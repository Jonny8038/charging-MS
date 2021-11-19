//获得角度的函数
function getAngle(n,next){
    var ret
    var w1 = n.lat/180 * Math.PI
    var j1 = n.lng/180 * Math.PI

    var w2 = next.lat/180 * Math.PI
    var j2 = next.lng/180 * Math.PI

    ret = 4 * Math.pow(Math.sin((w1 - w2) / 2), 2) - Math.pow(Math.sin((j1 - j2) / 2) * (Math.cos(w1) - Math.cos(w2)), 2);
    ret = Math.sqrt(ret);

    // var temp = Math.sin(Math.abs(j1 - j2) / 2) * (Math.cos(w1) + Math.cos(w2));
    var temp = Math.sin((j1 - j2) / 2) * (Math.cos(w1) + Math.cos(w2));
    ret = ret/temp;

    ret = Math.atan(ret) / Math.PI * 180 ;
    ret += 90;

    // 这里用如此臃肿的if..else是为了判定追踪单个点的具体情况,从而调整ret的值
    if(j1-j2 < 0){
        // console.log('j1<j2')
        if(w1-w2 < 0){
            // console.log('w1<w2')
            ret;
        }else{
            // console.log('w1>w2')
            ret = -ret+180;
        }
    }else{
        // console.log('j1>j2')
        if(w1-w2 < 0){
            // console.log('w1<w2')
            ret = 180+ret;
        }else{
            // console.log('w1>w2')
            ret = -ret;
        }
    }
    return ret ;
}

export{
    getAngle,
}
