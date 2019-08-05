const uuid = require('node-uuid');
module.exports = {
    // 生成唯一的uuid+时间戳
    uuidCode: function () {
        return uuid.v1().split('-').join("") + Date.now();
    },
    // 单据编号
    orderNumCode: function () {
        var time = new Date(Date.now());
        var y = time.getFullYear() + ""; //getFullYear方法以四位数字返回年份
        var M = (time.getMonth() + 1) + ""; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
        var d = time.getDate() + ""; // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)

        if (M.length == 1) {
            M = "0" + M
        }
        if (d.length == 1) {
            d = "0" + d
        }
        return "" + y + M + d + Date.now();
    },
    // 金额转大写
    digitUppercase: function (n) {
        var fraction = ['角', '分'];
        var digit = [
            '零', '壹', '贰', '叁', '肆',
            '伍', '陆', '柒', '捌', '玖'
        ];
        var unit = [
            ['元', '万', '亿'],
            ['', '拾', '佰', '仟']
        ];
        var head = n < 0 ? '欠' : '';
        n = Math.abs(n);
        var s = '';
        for (var i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';
        n = Math.floor(n);
        for (var i = 0; i < unit[0].length && n > 0; i++) {
            var p = '';
            for (var j = 0; j < unit[1].length && n > 0; j++) {
                p = digit[n % 10] + unit[1][j] + p;
                n = Math.floor(n / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return head + s.replace(/(零.)*零元/, '元')
            .replace(/(零.)+/g, '零')
            .replace(/^整$/, '零元整');
    }
}