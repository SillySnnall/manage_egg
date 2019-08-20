const Service = require('egg').Service;

const BodyData = require('../common/BodyData');
const Util = require('../common/Util');
class BackOrderS extends Service {
    // 添加退货单
    async add(data, userCode) {
        var order = {}
        // 初始化事务
        const conn = await this.app.mysql.beginTransaction();
        try {
            // 空判断
            if (data.customer_code == null || data.customer_code === "") {
                throw "客户编码为空"
            }
            // 空判断
            if (data.shop == null || data.shop === "") {
                throw "商店名字为空"
            }
            // 空判断
            if (data.order_write_code == null || data.order_write_code === "") {
                throw "下单员为空"
            }
            // 空判断
            if (data.num == null || data.num === 0) {
                throw "退货单总数为空"
            }
            // 空判断
            if (data.price == null || data.price === "" || data.price === "0.00") {
                throw "退货单总金额为空"
            }
            if (data.real_price == null || data.real_price === "" || data.real_price === "0.00") {
                throw "退货单实际金额为空"
            }
            // 空判断
            if (data.state == null) {
                throw "退货单状态为空"
            }
            // 空判断
            if (data.orderItemList == null || data.orderItemList.length === 0) {
                throw "退货单列表为空"
            }

            const uuid = Util.uuidCode();
            const cTime = Date.now();

            // 商品条目数据处理
            for (var i = 0; i < data.orderItemList.length; i++) {
                if (data.orderItemList[i].name == null || data.orderItemList[i].name === "") {
                    throw "商品名字为空"
                }
                if (data.orderItemList[i].commodity_code == null || data.orderItemList[i].commodity_code === "") {
                    throw "退货单商品编码为空"
                }
                if (data.orderItemList[i].bar_code == null || data.orderItemList[i].bar_code === "") {
                    throw "商品条形码为空"
                }
                if (data.orderItemList[i].num == null || data.orderItemList[i].num === 0) {
                    throw "退货单商品数量为空"
                }
                // 组合数据
                const orderItem = {
                    code: Util.uuidCode(),
                    order_code: uuid,
                    commodity_code: data.orderItemList[i].commodity_code,
                    bar_code: data.orderItemList[i].bar_code,
                    num: data.orderItemList[i].num,
                    unit: data.orderItemList[i].unit,
                    price: data.orderItemList[i].price,
                    name: data.orderItemList[i].name,
                    specifications: data.orderItemList[i].specifications,
                    money: data.orderItemList[i].money,
                    create_time: cTime,
                }
                // 数据库插入条目数据
                var results = await conn.insert('back_order_item', orderItem);
                // 判断是否插入成功
                if (results.affectedRows == 0) {
                    throw "添加失败"
                }
            }

            // 组合数据
            order = {
                code: uuid,
                customer_code: data.customer_code,
                order_write_code: data.order_write_code,
                num: data.num,
                order_num_code: Util.orderNumCode(),
                price_up: Util.digitUppercase(data.price),
                price: data.price,
                state: data.state,
                shop: data.shop,
                real_price: data.real_price,
                create_time: cTime,
                is_del: 0,
                posting_time: ""
            }
            // 数据库插入条目数据
            const result = await conn.insert('back_orders', order);
            // 判断是否插入成功
            if (result.affectedRows == 0) {
                throw "添加失败"
            }
            order.orderItemList = data.orderItemList
            await conn.commit(); // 提交事务
            this.app.logger.info('[登录用户]:' + userCode + '[BackOrderS.add]:' + JSON.stringify(order));
            return BodyData.successData(order);
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
        var order = {}
        // 初始化事务
        const conn = await this.app.mysql.beginTransaction();
        try {
            // 空判断
            if (data.customer_code == null || data.customer_code === "") {
                throw "客户编码为空"
            }
            if (data.order_num_code == null || data.order_num_code === "") {
                throw "单据编号为空"
            }
            if (data.shop == null || data.shop === "") {
                throw "商店名字为空"
            }
            if (data.order_write_code == null || data.order_write_code === "") {
                throw "下单员为空"
            }
            if (data.num == null || data.num === 0) {
                throw "退货单总数为空"
            }
            if (data.price == null || data.price === "" || data.price === "0.00") {
                throw "退货单总金额为空"
            }
            if (data.real_price == null || data.real_price === "" || data.real_price === "0.00") {
                throw "退货单实际金额为空"
            }
            if (data.state == null) {
                throw "退货单状态为空"
            }
            if (data.orderItemList == null || data.orderItemList.length === 0) {
                throw "退货单列表为空"
            }

            // 查询此退货单是否存在
            const orders = await conn.get('back_orders', {
                code: data.code
            });
            if (orders == null) {
                throw "退货单不存在"
            }
            // 获取退货单下的条目
            var orderItemList = await conn.select('back_order_item', {
                where: {
                    order_code: orders.code
                }, // WHERE 条件
            });
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
                if (data.orderItemList[i].name == null || data.orderItemList[i].name === "") {
                    throw "商品名字为空"
                }
                if (data.orderItemList[i].commodity_code == null || data.orderItemList[i].commodity_code === "") {
                    throw "退货单商品编码为空"
                }
                if (data.orderItemList[i].bar_code == null || data.orderItemList[i].bar_code === "") {
                    throw "商品条形码为空"
                }
                if (data.orderItemList[i].num == null || data.orderItemList[i].num === 0) {
                    throw "退货单商品数量为空"
                }
                // 组合数据
                const orderItem = {
                    code: Util.uuidCode(),
                    order_code: data.code,
                    commodity_code: data.orderItemList[i].commodity_code,
                    bar_code: data.orderItemList[i].bar_code,
                    num: data.orderItemList[i].num,
                    unit: data.orderItemList[i].unit,
                    price: data.orderItemList[i].price,
                    name: data.orderItemList[i].name,
                    specifications: data.orderItemList[i].specifications,
                    money: data.orderItemList[i].money,
                    create_time: data.create_time
                }
                // 数据库插入条目数据
                var results = await conn.insert('back_order_item', orderItem);
                // 判断是否插入成功
                if (results.affectedRows == 0) {
                    throw "添加失败"
                }
            }

            // 数据库插入条目数据
            result = await conn.update('back_orders', {
                code: data.code,
                customer_code: data.customer_code,
                order_write_code: data.order_write_code,
                num: data.num,
                order_num_code: data.order_num_code,
                price_up: Util.digitUppercase(data.price),
                price: data.price,
                state: data.state,
                real_price: data.real_price,
                shop: data.shop,
                create_time: data.create_time,
                is_del: data.is_del,
                posting_time: data.posting_time
            }, {
                where: {
                    code: data.code
                }
            });
            // 判断是否插入成功
            if (result.affectedRows == 0) {
                throw "修改失败"
            }
            orders.orderItemList = data.orderItemList
            await conn.commit(); // 提交事务
            this.app.logger.info('[登录用户]:' + userCode + '[BackOrderS.update]:' + JSON.stringify(orders));
            return BodyData.successData(orders);
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