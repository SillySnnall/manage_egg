const Service = require('egg').Service;

const BodyData = require('../common/BodyData');
const Util = require('../common/Util');
const IsEmputy = require('../common/IsEmputy');
class BackOrderS extends Service {
    // 添加退货单
    async add(data, userCode) {
        // 初始化事务
        const conn = await this.app.mysql.beginTransaction();
        try {
            //判空
            const err = IsEmputy.isEmputyOrderS1(data)
            if (err != "") {
                throw err
            }

            const uuid = Util.uuidCode();
            const cTime = Date.now();

            // 商品条目数据处理
            for (var i = 0; i < data.orderItemList.length; i++) {
                var orderItem = data.orderItemList[i];

                const err = IsEmputy.isEmputyOrderS2(orderItem)
                if (err != "") {
                    throw err
                }

                orderItem.code = Util.uuidCode()
                orderItem.order_code = uuid
                orderItem.create_time = cTime

                // 数据库插入条目数据
                var results = await conn.insert('back_order_item', orderItem);
                // 判断是否插入成功
                if (results.affectedRows == 0) {
                    throw "添加失败"
                }
            }

            data.code = uuid;
            data.order_num_code = Util.orderNumCode();
            data.price_up = Util.digitUppercase(data.price);
            data.create_time = cTime;
            data.is_del = 0;
            data.posting_time = "0";

            const orderItemList = data.orderItemList;
            // 先删除后面再加上
            delete data.orderItemList;
            // 数据库插入条目数据
            const result = await conn.insert('back_orders', data);
            // 判断是否插入成功
            if (result.affectedRows == 0) {
                throw "添加失败"
            }
            await conn.commit(); // 提交事务
            data.orderItemList = orderItemList
            this.app.logger.info('[登录用户]:' + userCode + '[BackOrderS.add]:' + JSON.stringify(data));
            return BodyData.successData(data);
        } catch (err) {
            this.app.logger.error(err);
            // error, rollback
            await conn.rollback(); // 一定记得捕获异常后回滚事务！！
            if ((err).constructor !== String) {
                err = "异常，添加失败"
            }
            return BodyData.failData(err);
        }
    }


    // 修改退货单
    async update(data, userCode) {
        // 初始化事务
        const conn = await this.app.mysql.beginTransaction();
        try {
            // 空判断
            const err = IsEmputy.isEmputyOrderS3(data)
            if (err != "") {
                throw err
            }

            // 查询此退货单是否存在
            const orders = await conn.get('back_orders', {
                code: data.code
            });
            if (orders == null) {
                throw "退货单不存在"
            }

            // 数据库删除数据（退货单条目）
            var result = await conn.delete('back_order_item', {
                order_code: orders.code,
            });
            // 判断是否删除成功
            if (result.affectedRows == 0) {
                throw "原来的条目无法删除，修改失败"
            }

            // 商品条目数据处理
            for (var i = 0; i < data.orderItemList.length; i++) {
                var orderItem = data.orderItemList[i];
                const err = IsEmputy.isEmputyOrderS2(orderItem)
                if (err != "") {
                    throw err
                }

                orderItem.code = Util.uuidCode();
                orderItem.order_code = data.code
                orderItem.create_time = data.create_time

                // 数据库插入条目数据
                var results = await conn.insert('back_order_item', orderItem);
                // 判断是否插入成功
                if (results.affectedRows == 0) {
                    throw "添加失败"
                }
            }
            data.price_up = Util.digitUppercase(data.price)
            var orderItemList = data.orderItemList
            // 先删除后面再加上
            delete data.orderItemList;
            // 数据库插入条目数据
            result = await conn.update('back_orders', data, {
                where: {
                    code: data.code
                }
            });
            // 判断是否插入成功
            if (result.affectedRows == 0) {
                throw "修改失败"
            }
            data.orderItemList = orderItemList
            await conn.commit(); // 提交事务
            this.app.logger.info('[登录用户]:' + userCode + '[BackOrderS.update]:' + JSON.stringify(data));
            return BodyData.successData(data);
        } catch (err) {
            this.app.logger.error(err);
            // error, rollback
            await conn.rollback(); // 一定记得捕获异常后回滚事务！！
            if ((err).constructor !== String) {
                err = "异常，修改失败"
            }
            return BodyData.failData(err);
        }
    }

    // 查询退货单
    async find(data, userCode) {
        // 组合查询数据
        var orderList = []
        const state = Number(data.searchType)
        const offset = Number(data.offset) * Number(data.limit)
        if (data.searchText == null || data.searchText == '') {
            var whereData = {}
            if (state != -1) {
                whereData = {
                    state: state,
                    is_del: 0
                }
            } else {
                whereData = {
                    is_del: 0
                }
            }
            orderList = await this.app.mysql.select('back_orders', { // 搜索 post 表
                where: whereData, // WHERE 条件
                orders: [
                    ['create_time', 'desc']
                ], // 排序方式
                offset: Number(offset), // 数据偏移量
                limit: Number(data.limit) // 返回数据量
            });
        } else {
            var stateData = ""
            if (state != -1) {
                stateData = "state =" + state + " and "
            }
            //  条件，模糊，排序 查询
            orderList = await this.app.mysql.query(
                "select * from back_orders where is_del = 0 and " + stateData + "shop like '%" + data.searchText + "%' ORDER BY 'create_time' DESC LIMIT " + Number(offset) + "," + Number(data.limit)
            )
        }
        this.app.logger.info('[登录用户]:' + userCode + '[BackOrderS.find]:' + JSON.stringify(orderList));
        return BodyData.successData(orderList);
    }

    // 删除商品
    async delete(data, userCode) {
        // 查询此客户是否存在
        const back_orders = await this.app.mysql.get('back_orders', {
            code: data.code
        });
        if (back_orders == null) {
            return BodyData.failData("订单不存在");
        }
        // 数据库删除数据
        back_orders.is_del = 1;
        const result = await this.app.mysql.update('back_orders', back_orders);
        // 判断是否删除成功
        if (result.affectedRows == 0) {
            return BodyData.failData("删除失败");
        }
        this.app.logger.info('[登录用户]:' + userCode + '[OrderS.delete]:' + JSON.stringify(back_orders));
        return BodyData.successData("删除成功");
    }


    // 删除商品
    async deleteReally(data, userCode) {
        // 初始化事务
        const conn = await this.app.mysql.beginTransaction();
        try {
            // 数据库删除数据（退货单）
            var result = await conn.delete('back_orders', {
                code: data.code,
            });
            // 判断是否删除成功
            if (result.affectedRows == 0) {
                throw "删除失败"
            }
            // 数据库删除数据（退货单条目）
            result = await conn.delete('back_order_item', {
                order_code: data.code,
            });
            // 判断是否删除成功
            if (result.affectedRows == 0) {
                throw "删除失败"
            }
            await conn.commit(); // 提交事务
            this.app.logger.info('[登录用户]:' + userCode + '[BackOrderS.delete]:' + data.code);
            return BodyData.successData("删除成功");
        } catch (err) {
            this.app.logger.error(err);
            // error, rollback
            await conn.rollback(); // 一定记得捕获异常后回滚事务！！
            if ((err).constructor !== String) {
                err = "异常，删除失败"
            }
            return BodyData.failData(err);
        }
    }

    // 查询退货单
    async findOrderItem(data, userCode) {
        // 搜索 order_item 表
        const orderItemList = await this.app.mysql.select('back_order_item', {
            where: {
                order_code: data.code
            } // WHERE 条件
        });
        this.app.logger.info('[登录用户]:' + userCode + '[BackOrderS.findOrderItem]:' + JSON.stringify(orderItemList));
        return BodyData.successData(orderItemList);
    }

    // 销售单状态改变
    async stateChange(data, userCode) {
        const result = await this.app.mysql.update('back_orders', {
            state: data.state,
            posting_time: Date.now()
        }, {
            where: {
                code: data.code
            }
        });
        // 判断是否修改成功
        if (result.affectedRows == 0) {
            return BodyData.failData("状态更改失败");
        }
        this.app.logger.info('[登录用户]:' + userCode + '[BackOrderS.stateChange]:' + 'state:' + data.state + 'code:' + data.code);
        return BodyData.successData("状态更改成功");
    }

    // 获取打印订单数据
    async getPrintOrders(data, userCode) {
        // 空判断
        if (data.code == null || data.code === "") {
            return BodyData.failData("订单编码为空");
        }
        // 获取订单
        const orders = await this.app.mysql.get('back_orders', {
            code: data.code
        });
        // 获取客户
        const customer = await this.app.mysql.get('customer', {
            code: orders.customer_code
        });

        orders.phone = customer.phone

        // 获取订单条目
        const orderItemList = await this.app.mysql.select('back_order_item', {
            where: {
                order_code: data.code
            } // WHERE 条件
        });
        for (var i = 0; i < orderItemList.length; i++) {
            // 获取商品
            const commodity = await this.app.mysql.get('commodity', {
                code: orderItemList[i].commodity_code
            });
            orderItemList[i].weight = commodity.weight
        }

        orders.orderItemList = orderItemList

        // 获取公司信息
        const company = await this.app.mysql.get('company', {
            id: 1
        });

        this.app.logger.info('[登录用户]:' + userCode + '[BackOrderS.getPrintOrders]:' + JSON.stringify({
            company: company,
            orders: orders
        }));
        return BodyData.successData({
            company: company,
            orders: orders
        });
    }


    // 查询订单
    async findDateOrder(data, userCode) {
        // 空判断
        if (data.startDate == null || data.startDate === "") {
            return BodyData.failData("开始时间为空");
        }
        // 空判断
        if (data.endDate == null || data.endDate === "") {
            return BodyData.failData("结束时间为空");
        }
        // 组合查询数据
        var orderList = []
        const offset = Number(data.offset) * Number(data.limit)
        //  条件，范围，排序 查询
        orderList = await this.app.mysql.query(
            "select * from back_orders where is_del = 0 and state = 3 and posting_time between " + data.startDate + " and " + data.endDate + " ORDER BY 'posting_time' DESC LIMIT " + Number(offset) + "," + Number(data.limit)
        )
        this.app.logger.info('[登录用户]:' + userCode + '[OrderS.findDateOrder]:' + JSON.stringify(orderList));
        return BodyData.successData(orderList);
    }
}

module.exports = BackOrderS;
// CREATE TABLE `back_orders` (
//     `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
//     `code` varchar(45) NOT NULL COMMENT '退货单编码',
//     `customer_code` varchar(45) NOT NULL COMMENT '客户编码',
//     `order_num_code` varchar(21) NOT NULL COMMENT '单据编号',
//     `order_write_code` varchar(45) NOT NULL COMMENT '下单员',
//     `num` int(11) NOT NULL COMMENT '退货单总数',
//     `price` varchar(20) NOT NULL COMMENT '退货单总金额',
//     `price_up` varchar(30) NOT NULL COMMENT '退货单总金额大写',
//     `state` int(1) NOT NULL COMMENT '退货单状态（0未送货，1已付款，2欠款，3已过账）',
//     `create_time` varchar(13) NOT NULL COMMENT '创建时间',
//     `real_price` varchar(20) NOT NULL COMMENT '实际收款金额',
//     `shop` varchar(255) NOT NULL COMMENT '商店名字',
//     `is_del` int(2) NOT NULL COMMENT '是否删除了（0未删除，1已删除）',
//     `posting_time` varchar(13) NOT NULL COMMENT '过账时间',
//     PRIMARY KEY (`id`)
//   ) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8;


// CREATE TABLE `back_order_item` (
//     `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
//     `code` varchar(45) NOT NULL COMMENT '退货单条目编码',
//     `order_code` varchar(45) NOT NULL COMMENT '退货单编码',
//     `commodity_code` varchar(45) NOT NULL COMMENT '商品编码',
//     `num` int(11) NOT NULL COMMENT '数量',
//     `unit` varchar(2) NOT NULL COMMENT '单位',
//     `price` varchar(20) NOT NULL COMMENT '单价',
//     `create_time` varchar(13) NOT NULL COMMENT '创建时间',
//     `name` varchar(255) NOT NULL COMMENT '商品名字',
//     `specifications` int(11) NOT NULL COMMENT '商品规格（一件有几个）',
//     `bar_code` varchar(15) NOT NULL COMMENT '条形码',
//     `money` varchar(20) NOT NULL COMMENT '条目金额',
//     PRIMARY KEY (`id`)
//   ) ENGINE=InnoDB AUTO_INCREMENT=203 DEFAULT CHARSET=utf8;