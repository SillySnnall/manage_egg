module.exports = {
    isEmputyOrderS1: function (data) {
        // 空判断
        if (data.customer_code == null || data.customer_code === "") {
            return "客户编码为空"
        }
        // 空判断
        if (data.shop == null || data.shop === "") {
            return "商店名字为空"
        }
        // 空判断
        if (data.order_write_code == null || data.order_write_code === "") {
            return "下单员为空"
        }
        // 空判断
        if (data.num == null || data.num === 0) {
            return "总数为空"
        }
        // 空判断
        if (data.price == null || data.price === "" || data.price === "0.00") {
            return "总金额为空"
        }
        if (data.real_price == null || data.real_price === "" || data.real_price === "0.00") {
            return "实际金额为空"
        }
        // 空判断
        if (data.state == null) {
            return "状态为空"
        }
        // 空判断
        if (data.orderItemList == null || data.orderItemList.length === 0) {
            return "列表为空"
        }

        if (data.price_in == null || data.price_in === "" || data.price_in === "0.00") {
            return "进货价格为空"
        }
        if (data.price_out_down == null || data.price_out_down === "" || data.price_out_down === "0.00") {
            return "批发价格为空"
        }
        if (data.price_out == null || data.price_out === "" || data.price_out === "0.00") {
            return "正发价格为空"
        }
        return ""
    },

    isEmputyOrderS2: function (orderItem) {
        if (orderItem.name == null || orderItem.name === "") {
            return "商品名字为空"
        }
        if (orderItem.commodity_code == null || orderItem.commodity_code === "") {
            return "商品编码为空"
        }
        if (orderItem.bar_code == null || orderItem.bar_code === "") {
            return "商品条形码为空"
        }
        if (orderItem.num == null || orderItem.num === 0) {
            return "商品数量为空"
        }
        if (orderItem.price == null || orderItem.price == "" || orderItem.money == "0.00") {
            return "商品单价为空"
        }
        if (orderItem.money == null || orderItem.money == "" || orderItem.money == "0.00") {
            return "商品金额为空"
        }
        if (orderItem.price_in == null || orderItem.price_in === "" || orderItem.price_in === "0.00") {
            return "进货价格为空"
        }
        if (orderItem.price_out_down == null || orderItem.price_out_down === "" || orderItem.price_out_down === "0.00") {
            return "批发价格为空"
        }
        if (orderItem.price_out == null || orderItem.price_out === "" || orderItem.price_out === "0.00") {
            return "正发价格为空"
        }
        return ""
    },

    isEmputyOrderS3: function (data) {
        if (data.customer_code == null || data.customer_code === "") {
            return "客户编码为空"
        }
        if (data.order_num_code == null || data.order_num_code === "") {
            return "单据编号为空"
        }
        if (data.shop == null || data.shop === "") {
            return "商店名字为空"
        }
        if (data.order_write_code == null || data.order_write_code === "") {
            return "下单员为空"
        }
        if (data.num == null || data.num === 0) {
            return "总数为空"
        }
        if (data.price == null || data.price === "" || data.price === "0.00") {
            return "总金额为空"
        }
        if (data.real_price == null || data.real_price === "" || data.real_price === "0.00") {
            return "实际金额为空"
        }
        if (data.state == null) {
            return "状态为空"
        }
        if (data.orderItemList == null || data.orderItemList.length === 0) {
            return "列表为空"
        }
        if (data.price_in == null || data.price_in === "" || data.price_in === "0.00") {
            return "进货价格为空"
        }
        if (data.price_out_down == null || data.price_out_down === "" || data.price_out_down === "0.00") {
            return "批发价格为空"
        }
        if (data.price_out == null || data.price_out === "" || data.price_out === "0.00") {
            return "正发价格为空"
        }
        return ""
    },
}