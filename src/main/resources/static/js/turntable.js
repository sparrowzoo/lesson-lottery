/**
 * @param {Object} options
 * @param {String} options.canvas canvas
 * @param {Array}  options.list  存储奖品的的列表，example [{1:{name:'谢谢参与',image:'1.jpg'}}]
 * @param {Object} options.outerCircle {color:'#df1e15'} 外圈颜色，默认红色
 * @param {Object} options.innerCircle {color:'#f4ad26'} 里圈颜色，默认黄色
 * @param {Array}  options.dots ['#fbf0a9', '#fbb936'] 装饰点颜色 ，默认深黄浅黄交替
 * @param {Array}  options.disk ['#ffb933', '#ffe8b5', '#ffb933', '#ffd57c', '#ffb933', '#ffe8b5', '#ffd57c'] 中心奖盘的颜色，默认7彩
 * @param {Object} options.title {color:'#5c1e08',font:'19px Arial'} 奖品标题颜色
 */
WheelSurf = function (options) {
    this.config = {
        outerCircle: {
            color: '#df1e15'
        },
        innerCircle: {
            color: '#f4ad26'
        },
        dots: ['#fbf0a9', '#fbb936'],
        disk: ['#ffb933', '#ffe8b5', '#ffb933', '#ffd57c', '#ffb933', '#ffe8b5', '#ffd57c'],
        title: {
            color: '#5c1e08',
            font: '19px Arial'
        }
    };
    if (options) {
        if (options.list) {
            this.config.list = options.list;
        }
        if (options.dots) {
            this.config.dots = options.dots;
        }
        if (options.outerCircle) {
            this.config.outerCircle = options.outerCircle;
        }
        if (options.innerCircle) {
            this.config.innerCircle = options.innerCircle;
        }
        if (options.canvas) {
            this.config.canvas = options.canvas;
        }
        if (options.title) {
            this.config.title = options.title;
        }
    }
    this.canvas = document.getElementById(this.config.canvas);
    // 画布中心移动到canvas中心
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.canvas.getContext("2d");
    this.imgs = [];
    this.awardTitle = [];
    this.awardPic = [];
    for (var i=0;i<this.config.list.length;i++) {
        this.awardTitle.push(this.config.list[i].name)
        this.imgs.push(this.config.list[i].image)
    }
    this.num = this.imgs.length;
    // 圆心
    var x = this.width / 2;
    var y = this.height / 2;
    this.ctx.translate(x, y)
};

WheelSurf.prototype.init = function (degree) {
    degree = degree ||0;
    var ctx = this.ctx;
    ctx.beginPath();
    //在x轴为300，y轴为300的位置绘制边框的正方形区域
    // ctx.rect(-300,-300,600,600);
    // ctx.fill();
    //ctx.clearRect(-this.width/2, -this.height/2, this.width, this.height);
    //每个角度的孤度
    var anglePerDegree = 2 * Math.PI / 360;
    var degreePerSector = 360 / this.num;
    //1rad=360/2π ==> 1rad=180°/π≈57.3°(两边同时*2π) ==>2π=360°
    var angelPerSector = anglePerDegree * degreePerSector;
    //逆时针旋转90度
    var startAngel = anglePerDegree * (-90);
    var endAngel = startAngel + angelPerSector;
    // 旋转画布
    ctx.save();
    ctx.rotate(degree * anglePerDegree);
    ctx.moveTo(0, 0);
    ctx.lineTo(600, 0);//画X轴
    ctx.moveTo(0, 0);//
    ctx.lineTo(0, 600);//画Y轴
    ctx.stroke()
    // 画外圆
    ctx.beginPath();
    ctx.lineWidth = 25;
    ctx.strokeStyle = this.config.outerCircle.color;
    ctx.arc(0, 0, 243, 0, 2 * Math.PI)
    ctx.stroke();
    // 画里圆
    ctx.beginPath();
    ctx.lineWidth = 23;
    ctx.strokeStyle = this.config.innerCircle.color;
    ctx.arc(0, 0, 218, 0, 2 * Math.PI)
    ctx.stroke();

    //装饰点
    var dotColor = this.config.dots
    for (var i = 0; i < 12; i++) {
        // 装饰点 圆心 坐标计算
        ctx.beginPath();
        var radius = 230;
        var xr = radius * Math.cos(startAngel);
        var yr = radius * Math.sin(startAngel);

        ctx.fillStyle = dotColor[i % dotColor.length];
        ctx.arc(xr, yr, 11, 0, 2 * Math.PI);
        ctx.fill();
        startAngel += anglePerDegree * (360 / 12);
    }

    // 画里转盘
    var colors = this.config.disk;
    for (var i = 0; i < this.num; i++) {
        ctx.beginPath();
        ctx.lineWidth = 208;
        ctx.strokeStyle = colors[i % colors.length]
        ctx.arc(0, 0, 104, startAngel, endAngel)
        ctx.stroke();
        startAngel = endAngel
        endAngel += angelPerSector
    }

    //添加奖品
    this.initImage().then((awardPic) => {
        startAngel = angelPerSector / 2
        for (var i = 0; i < this.num; i++) {
            ctx.save();
            ctx.rotate(startAngel)
            ctx.drawImage(awardPic[i], -48, -48 - 130);
            ctx.font = this.config.title.font;
            ctx.fillStyle = this.config.title.color
            ctx.textAlign = "center";
            ctx.fillText(this.awardTitle[i], 0, -170);
            startAngel += angelPerSector
            ctx.restore();
        }
        ctx.restore();
    });
};

WheelSurf.prototype.initImage = function () {
    var that = this;
    return new Promise((resolve, reject) => {
        var countImg = 0
        if (that.awardPic.length) {
            return resolve(that.awardPic);
        }
        for (var i = 0; i < that.num; i++) {
            var img = new Image()
            that.awardPic.push(img)
            img.src = that.imgs[i]
            img.onload = function () {
                countImg++
                if (countImg === that.num) {
                    resolve(that.awardPic);
                }
            }
        }
    });
};
/**
 * @param degree 旋转角度
 * @param callback 转完后的回调函数
 */
WheelSurf.prototype.lottery = function (degree, callback) {
    degree = degree || 0
    degree = 360 - degree
    degree += 360;//多转一圈
    // 基值
    var baseStep = 30
    var baseSpeedPercent = 0.3
    var reduceSpeedPercent=0.2;
    // 步长
    var passedDegree = 1;
    var _this = this
    var timer = setInterval(function () {
        _this.init(passedDegree)
        if (passedDegree === degree) {
            clearInterval(timer)
            if (typeof callback == "function") {
                callback();
                return;
            }
        }
        var residuePercent=(degree - passedDegree) / degree;
        console.log(residuePercent+"-"+(residuePercent>baseSpeedPercent));
        //剩余角度百分比>reduceSpeedPercent 时则每次递增baseSpeedPercent，否则按实际剩余百分比递增
        passedDegree = passedDegree + baseStep * (residuePercent > reduceSpeedPercent ? baseSpeedPercent : residuePercent);
        if (degree - passedDegree < 0.5) {
            passedDegree = degree
        }
    }, 25);
};
