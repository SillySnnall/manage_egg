'use strict';

const Controller = require('egg').Controller;
const uuid = require('node-uuid');

const Util = require('../common/Util');
class TestC extends Controller {

    async index() {


        // try {
        //     console.log("33333")
        //     throw "沙龙的骄傲了"
        //     console.log("lskajl")
        // } catch (error) {
        //     this.ctx.body = error
        // }
        this.ctx.body = Date.now()
        // const creatuuid = uuid.v1()
        // uuid.v1().split('-').join("") + Date.now()
        // const results = await this.app.mysql.get('customer', {
        //     code: 'sasdasda'
        // });
        // var xxx = 3
        // const results = await this.app.mysql.query("select * from customer where shop like '%${xxx}%' ORDER BY `create_time` DESC")

        // const customerList = await this.app.mysql.select('customer', { // 搜索 post 表
        //     where: {
        //         shop:'%3%'
        //     }, // WHERE 条件
        //     orders: [
        //       ['create_time', 'desc']
        //     ], // 排序方式
        //     offset: 0, // 数据偏移量
        //     limit: 30 // 返回数据量
        //   });
        // for (var i = 0; i < 54; i++) {
        //     const results = await this.ctx.service.commodityS.add({
        //         name: 'data.name',
        //         weight: 12,
        //         specifications: 24,
        //         home: "data.home",
        //         bar_code: '21321321321',
        //         expire: 'data.expire',
        //         price_in: '23.40',
        //         price_out: '223.40',
        //         price_out_down: '237.40',
        //         stock: 100,
        //     });
        // }

        // 返回数据
        // this.ctx.body = Util.orderNumCode()

        // 4152a9d0b21311e99f97c1bdd195d43d1564413138157
    }
}

module.exports = TestC;