module.exports = {
    // 成功的数据
    successData: function (data, msg = 0) {
        return {
            data: data, // 数据
            error: "", // 错误消息
            msg: msg, // 状态码
        }
    },
    // 失败的数据
    failData: function (error = "", msg = -1) {
        return {
            data: "", // 数据
            error: error, // 错误消息
            msg: msg, // 状态码
        }
    },

}