var express  = require('express');
var alidayu  = require('../alidayu/test');
var router   = express.Router();
var mongoose = require('mongoose');
//连接数据库
mongoose.connect('mongodb://localhost/graduation_project');
var db = mongoose.connection;
db.on('error', function(error){
    console.log(error);
});
db.once('open', function(){
    console.log("graduation_project connect success");
});
var userSchema = new mongoose.Schema({
    userName: String,
    phone: String,
    userPwd : String
});
var userModel = db.model('user', userSchema, "user");
var checkCodeSchema = new mongoose.Schema({
    phone: String,
    checkCode : String
});
var checkCodeModel = db.model('checkCode', checkCodeSchema, "checkCode");
//查询用户名并核对用户密码
var checkLogin = function(req, callback){
    userModel.findOne({phone: req.body.phone},function(err, data){
        console.log(data, "===========================================================================login data");
        if(err){
            console.log(err);
            callback(500);
        }else{
            if(data == null){
                callback(401004);
            }else if(req.body.userPwd == data.userPwd){
                callback(200, {id: data._id , userName: data.userName});
            }else{
                callback(401003);
            }
        }
    })
}

//用户登录
router.post('/client/login', function(req, res){
    checkLogin(req, function(status, data) {
        if(status == 200) {
            res.statusCode = 200;
            res.cookie('info', data, {path: '/', maxAge: 30*60*1000});
            console.log(data, '===');
            res.send(data);
        }else if(status == 401003) {
            res.statusCode = 401;
            res.send({
                errorCode: 401,
                message: '密码错误',
            });
        }else if(status == 401004) {
            res.statusCode = 401;
            res.send({
                errorCode: 401,
                message: '该用户不存在',
            });
        }else if(status == 500) {
            res.statusCode == 500;
            res.send({
                errorCode: 500,
                message: '服务器内部错误',
            });
        }
    });
})
//保存用户信息到cookie
router.get('/client/info', function(req, res){
    console.log(req.cookies, "-----req.cookie");
    if(req.cookies.info) {
        res.statusCode = "200";
        res.send(req.cookies.info);
    }else{
        res.statusCode = "401";
        res.send({});
    }
})
//用户退出
router.delete('/client/logout', function(req, res){
    res.clearCookie('info');
    res.statusCode = '200';
    res.send({meesage: "logout success"});
})
//用户注册数据库操作
var checkRegist = function(req, callback) {
    if(req.cookies.checkCode) {
        var userName = req.body.userName;
        var phoneNum = req.body.phone;
        var checkCode= req.body.checkCode;
        checkCodeModel.findOne({phone: phoneNum}, function(err, data){
            console.log(data, "=========================================================checkCode in dataBase");
            if(err){
                console.log(err);
                callback(500);
            }else if(data == null){
                callback(401001, '验证码错误');
            }else if(checkCode == data.checkCode) {
                //验证手机是否已经注册
                userModel.find({phone: phoneNum}, function(err, data){
                    console.log(data, "=========================================================phone registed?");
                    if(err){
                        console.log(err);
                        callback(500);
                    }else if(data instanceof Array && data.length > 0){
                        console.log('该手机已经注册');
                        callback(401002, '该手机已经注册,请用其它手机号码');
                    }else{
                        //保存用户信息到数据库
                        userModel.create({userName: userName, phone: phoneNum, userPwd: req.body.userPwd}, function(err, data){
                            console.log(data, "=========================================================regist data");
                            if(err){
                                console.log(err, "-------------regist insert error");
                                callback(500);
                            }else{
                                console.log(err, "-------------regist insert success");
                                callback(200, {id: data._id, phone: data.phone});
                            }
                        });
                    }
                });
            }else{
                callback(401001, '验证码错误');
            }
        });
    }else{
        callback(401001, '验证码错误');
    }
}

//用户注册返回结果
router.post('/client/regist', function(req, res){
    checkRegist(req, function(status, data){
        if(status == 200) {
            res.statusCode = 200;
            res.send(data);
        }else if(status == 401001) {
            res.statusCode = 401,
            res.send({
                errorCode: 401001,
                message: data,
            });
        }else if(status == 401002){
            res.statusCode = 401;
            res.send({
                errorCode: 401002,
                message: data,
            });
        }else if(status == 500) {
            res.statusCode = 500;
            res.send({
                errorCode: 500,
                message: '服务器内部错误',
            });
        }
    });
})

//生成验证码
function createCheckCode(len) {
    var str = '';
    for(var i = 1; i <= len; i++) {
        str = str + Math.floor(10*Math.random());
        console.log(str, '====str');
    }
    console.log(len, str, "================================================================================================createCheckCode()");
    return str;
}
//保存验证码到数据库
function saveCheckCode(phoneNum, random, callback) {
    //查找数据库是否有重复验证码
    checkCodeModel.findOne({phone: phoneNum}, function(err, data){
        if(err) {
            callback(500);
            console.log(err);
        }else{
            checkCodeModel.remove({phone: phoneNum}, function(err, data){
                if(err){
                    callback(500);
                    console.log(err);
                }else{
                    console.log(data, '================================================================================================saveCheckCode()');
                    checkCodeModel.create({phone: phoneNum, checkCode: random}, function(err, data){
                        if(err){
                            callback(500);
                            console.log(err, "-------------insert checkCode error");
                        }else{
                            callback(200);
                            console.log(data, "-------------insert checkCode success");
                        }
                    })
                }
            })
        }
    });
}
//发送并保存验证码
function postCheckCode(phoneNum, random, type, callback) {
    var config = {
        regist: {
            sms_free_sign_name: '大鱼测试',
            sms_template_code: 'SMS_7760522',
        },
        changePhone: {
            sms_free_sign_name: '大鱼测试',
            sms_template_code: 'SMS_7760522',
        },
        findPwd: {
            sms_free_sign_name: '大鱼测试',
            sms_template_code: 'SMS_7760522',
        }
    };
    alidayu.execute('alibaba.aliqin.fc.sms.num.send', {
        'extend':'123456',
        'sms_type':'normal',
        'sms_free_sign_name': config[type]['sms_free_sign_name'],
        'sms_param': {"code": random,"product": "国风装修"},
        'rec_num': phoneNum,
        'sms_template_code': config[type]['sms_template_code']
    }, function(error, response) {
        if (!error) {
            console.log(response, "================================================================================================postCheckCode()");
            saveCheckCode(phoneNum, random, callback);
        }else {
            callback(500);
            console.log(error, '======postCheckCode_error')
        };
    })
}
//获取验证码
router.post('/client/checkCode', function(req, res){
    var phoneNum = req.body.phone;
    var random = createCheckCode(4);
    var type = req.body.type;
    console.log(req.body, '===req');
    postCheckCode(phoneNum, random, type, function(status) {
        if(status == 200) {
            res.statusCode = 200;
            res.cookie('checkCode', phoneNum, {maxAge: 24*60*60*1000});
            res.end();
        }else if(status == 500) {
            res.statusCode = 500;
            res.send({
                errorCode: 500,
                message: '服务器内部错误',
            });
        }
    });
})
//查询用户信息
function checkUserInfo(req, callback){
    var pwd = req.body.userPwd;
    var id  = req.cookies.info.id;
    userModel.findOne({_id: id}, function(err, data) {
        if(err) {
            console.log(err);
            callback(500);
        }else{
            console.log(data, '=====================================================checkPwd');
            if(data == null || (data instanceof Array && data.length == 0)) {
                callback(404);
            }else if(data.userPwd == pwd){
                callback(200);
            }else{
                callback(404);
            }
        }
    });
}

//验证个人设置用户原密码是否正确
router.post('/client/checkPwd', function(req, res){
    checkUserInfo(req, function(status) {
        if(status == 200) {
            res.statusCode = 200;
            res.send({
                id: req.cookies.info.id,
            });
        }else if(status == 404){
            res.statusCode = 404;
            res.send({
                errorCode: 404,
                message: '原密码错误',
            })
        }else if(status == 500) {
            res.statusCode = 500;
            res.send({
                errorCode: 500,
                message: '服务器内部错误',
            });
        }
    });
})
//修改用户数据库密码
function changePwd(req, callback) {
    var userPwd = req.body.befPwd;
    var newPwd  = req.body.newPwd;
    var id = req.cookies.info.id;
    userModel.findOne({_id: id}, function(err, data) {
        if(err) {
            console.log(err);
            callback(500);
        }else {
            if(userPwd == data.userPwd) {
                userModel.findByIdAndUpdate(id, {$set: {userPwd: newPwd}}, function(err, data) {
                    if(err) {
                        console.log(err);
                        callback(500);
                    }else{
                        callback(200);
                    }
                })
            }else{
                callback(404);
            }
        }
    });

}

//修改密码
router.post('/client/changePwd', function(req, res) {
    changePwd(req, function(status) {
        if(status == 200) {
            res.statusCode = 200;
            res.clearCookie('info');
            res.send({
                id: req.cookies.info.id,
            })
        }else if(status == 404) {
            res.statusCode = 404;
            res.send({
                errorCode: 404,
                message: '原密码错误',
            })
        }else if(status == 500){
            res.statusCode = 500;
            res.send({
                errorCode: 500,
                message: '服务器内部错误',
            })
        }
    });
})

//修改用户名称
function changeName(req, callback) {
    var id = req.cookies.info.id;
    var userName = req.body.userName;
    userModel.update({_id: id}, {$set: {userName: userName}}, function(err) {
        if(err) {
            console.log(err);
            callback(500);
        }else{
            callback(200);
        }
    })
}

//修改用户名
router.post('/client/changeName', function(req, res) {
    var userName = req.body.userName;
    changeName(req, function(status) {
        if(status == 200) {
            res.statusCode = 200;
            res.cookie('info', {id: req.cookies.info.id, userName: userName});
            console.log(userName, '------------------');
            res.send({
                id: req.cookies.info.id,
                userName: userName
            })
        }else if(status == 500){
            res.statusCode = 500;
            res.send({
                errorCode: 500,
                message: '服务器内部错误',
            })
        }
    });
})
function changePhone(req, callback) {
    var befPhone = req.body.befPhone;
    var newPhone = req.body.newPhone;
    var checkCode= req.body.checkCode;
    var id = req.cookies.info.id;
    if(req.cookies.checkCode) {
        console.log(befPhone);
        checkCodeModel.findOne({phone: befPhone}, function(err, data) {
            console.log(data, '============================changePhone data');
            if(err){
                console.log(err);
                callback(500);
            }else{
                if(data == null){
                    callback(401001);
                }else if(data.checkCode == checkCode){
                    userModel.update({_id: id}, {$set: {phone: newPhone}}, function(err){
                        if(err){
                            console.log(err);
                            callback(500);
                        }else{
                            callback(200);
                        }
                    })
                }else{
                    callback(401001);
                }
            }
        })
    }else{
        callback(401001);
    }

}

//修改手机号码
router.post('/client/changePhone', function(req, res) {
    changePhone(req, function(status){
        if(status == 200) {
            res.statusCode = 200;
            res.send({
                id: req.cookies.info.id,
            })
        }else if(status == 401001){
            res.statusCode = 401;
            res.send({
                errorCode: 401,
                message: '验证码错误',
            })
        }else if(status == 401002){
            res.statusCode = 401;
            res.send({
                errorCode: 401,
                message: '用户不存在',
            })
        }else if(status == 500){
            res.statusCode = 500;
            res.send({
                errorCode: 500,
                message: '服务器内部错误',
            })
        }
    })
})
function findPwd(req, callback) {
    var phone = req.body.phone;
    var checkCode = req.body.checkCode;
    var newPwd = req.body.newPwd;
    userModel.findOne({phone: phone}, function(err, data) {
        console.log(data, '=======================================findPwd data');
        if(err){
            console.log(err);
        }else{
            if(data == null) {
                callback(404003);
            }else{
                var id = data._id;
                checkCodeModel.findOne({phone: phone}, function(err, data){
                    console.log(data, '=====================================find checkCode');
                    if(err) {
                        console.log(err);
                    }else{
                        if(data == null){
                            callback(401001);
                        }else if(data.checkCode == checkCode) {
                            userModel.update({_id: id}, {$set:{userPwd: newPwd}}, function(err){
                                if(err){
                                    console.log(err);
                                }else{
                                    callback(200, id)
                                }
                            })
                        }else{
                            callback(401001);
                        }
                    }
                })
            }
        }
    })
}
//找回密码
router.post('/client/resetPwd', function(req, res) {
    findPwd(req, function(status, data) {
        if(status == 200) {
            res.statusCode = 200;
            res.send({
                id: data,
            })
        }else if(status == 404003) {
            res.statusCode = 404;
            res.send({
                errorCode: 404,
                message: '该手机号码暂未注册',
            })
        }else if(status == 401001){
            res.statusCode = 401;
            res.send({
                errorCode: 401,
                message: '验证码错误',
            })
        }
    })
})

module.exports = router;
