let mongoose=require('mongoose')
let User=require('../models/User')

let chai=require('chai');
let chaiHttp=require('chai-http');
let app=require('../app');
let should=chai.should();

chai.use(chaiHttp);
let code=0
let token=""
describe('Users',()=>{
    it('Delete all users',(done)=>{
        //before each test we empty the database
        User.deleteMany({},(err)=>{
            console.log(err);
            done();
        });
    });
});


// describe('/GET user', ()=>{
//     //makes sure there are no users to start with
//     it('it should get all the users',(done)=>{
//         chai.request(app).get('/user/all')
//         .end((err,res)=>{
//             res.should.have.status(200);
//             res.body.should.be.a('object');
//             res.body.should.have.property('code').eql(1);
//             res.body.data.length.should.be.eql(0);
//             done();
//         });
//     });
// });

describe('/POST user',()=>{
    it('it should not create a user without email or phone',(done)=>{
        let user={
            name:"Hallenu",
            email:"holij@gmail.com",
            password:"11111"
        }
        chai.request(app).post('/user').send(user)
        .end((err,res)=>{
            res.should.have.status(200);
            res.should.be.a('object');
            res.body.should.have.property('errors');
            done();
        });
    });

    it('it should create a user',(done)=>{
        let user={
            name:"Hallenu",
            email:"holij@gmail.com",
            phone:"029339488",
            password:"11111"
        }
        chai.request(app).post('/user').send(user)
        .end((err,res)=>{
            res.should.have.status(200);
            res.should.be.a('object');
            code=res.body.data["code"]
            res.body.should.have.property('code').eql(1);
            res.body.should.have.property('data');
            res.body.should.have.property('message');
            res.body.data.should.have.property('name');
            done();
        });
    });

    it('it should not sign a user in if the user is not confirmed',(done)=>{
        let user={
            email:"holij@gmail.com",
            password:"11111"
        }
        chai.request(app).post('/user/signin').send(user)
        .end((err,res)=>{
            res.should.have.status(200);
            res.should.be.a('object');
            res.body.should.have.property('code').eql(0);
            done();
        });
    });

       //USER CONFIRMATION
    
    it('it should confim a user account',(done)=>{
        let user={
            code:code
        }
        chai.request(app).post('/user/confirm').send(user)
        .end((err,res)=>{
            res.should.have.status(200);
            res.should.be.a('object');
            res.body.should.have.property('code').eql(1);
            res.body.should.have.property('data')
            res.body.data.should.have.property('confirmed').eql(true)
            done();
        });
    });


    it('it should not confim a user account with wrong code',(done)=>{
        let user={
            code:450299
        }
        chai.request(app).post('/user/confirm').send(user)
        .end((err,res)=>{
            res.should.have.status(200);
            res.should.be.a('object');
            res.body.should.have.property('code').eql(0);
            done();
        });
    });

    it('it should sign a user in',(done)=>{
        let user={
            email:"holij@gmail.com",
            password:"11111"
        }
        chai.request(app).post('/user/signin').send(user)
        .end((err,res)=>{
            res.should.have.status(200);
            res.should.be.a('object');
            token=res.body.token
            res.body.should.have.property('code').eql(1);
            res.body.should.have.property('token');
            done();
        });
    });

    it('it should not sign a user in if the email or password is not there',(done)=>{
        let user={
            email:"holij@gmail.com"
        }
        chai.request(app).post('/user/signin').send(user)
        .end((err,res)=>{
            res.should.have.status(200);
            res.should.be.a('object');
            res.body.should.have.property('code').eql(0);
            done();
        });
    });

    
    it('it should not sign a user in with inexisting email',(done)=>{
        let user={
            email:"holiNMMIOj@gmail.com"
        }
        chai.request(app).post('/user/signin').send(user)
        .end((err,res)=>{
            res.should.have.status(200);
            res.should.be.a('object');
            res.body.should.have.property('code').eql(0);
            done();
        });
    });

    
    it('it should not sign a user in if the password is incorrect',(done)=>{
        let user={
            email:"holij@gmail.com",
            password:"23nmdmolld"
        }
        chai.request(app).post('/user/signin').send(user)
        .end((err,res)=>{
            res.should.have.status(200);
            res.should.be.a('object');
            res.body.should.have.property('code').eql(0);
            done();
        });
    });

    //FORGOT PASS RESET

    it("it should not send code if the email does not exist ",(done)=>{
        let user={
            email:"Jolliow@gmail.com"
        }
        chai.request(app).post('/user/forgot_pass').send(user)
        .end((err,res)=>{
            res.should.have.status(200);
            res.should.be.a('object');
            res.body.should.have.property('code').eql(0);
            done();  
        })
    })

    it("it should send forgot password code",(done)=>{
        let user={
            email:"holij@gmail.com"
        }
        chai.request(app).post('/user/forgot_pass').send(user)
        .end((err,res)=>{
            res.should.have.status(200);
            res.should.be.a('object');
            res.body.should.have.property('code').eql(1);
            res.body.should.have.property('data')
            res.body.data.should.have.property('confirmed').eql(true)
            code=res.body.data["code"]
            done();  
        })
    })


    
    it("it should not change password if the code is wrong",(done)=>{
        let user={
            code:"092882"
        }
        chai.request(app).post('/user/forgot_pass').send(user)
        .end((err,res)=>{
            res.should.have.status(200)
            res.should.be.a('object')
            res.body.should.have.property('code').eql(0)
            done();  
        })
    })

    it("it should not change password if the new_password field is missing",(done)=>{
        let user={
            code:code
        }
        chai.request(app).post('/user/forgot_pass').send(user)
        .end((err,res)=>{
            res.should.have.status(200)
            res.should.be.a('object')
            res.body.should.have.property('code').eql(0)
            done();  
        })
    })
    it("it should change the user password",(done)=>{
        let user={
            code:code,
            new_password:"12345"
        }
        chai.request(app).post('/user/fchange_pass').send(user)
        .end((err,res)=>{
            res.should.have.status(200)
            res.should.be.a('object')
            res.body.should.have.property('code').eql(1)
            res.body.should.have.property('data')
            res.body.data.should.have.property('confirmed').eql(true)
            done();  
        })
    })
 
});


describe('User signed in', ()=>{
    it("it should get a signed in user",(done)=>{
        chai.request(app).get('/user/').set("token",token)
        .end((err,res)=>{
            res.should.have.status(200)
            res.should.be.a('object')
            res.body.should.have.property('code').eql(1)
            done();  
        })
    })

    it("it should not get user with wrong token",(done)=>{
        chai.request(app).get('/user/').set("token",token+"lodokdkm")
        .end((err,res)=>{
            res.should.have.status(500)
            res.should.be.a('object')
            res.body.should.have.property('code').eql(0)
            done();  
        })
    })

    it("it should not get user with no token",(done)=>{
        chai.request(app).get('/user/')
        .end((err,res)=>{
            res.should.have.status(200)
            res.should.be.a('object')
            res.body.should.have.property('code').eql(0)
            done();  
        })
    })
    let new_name="Dammionle"
    it("it should update user data",(done)=>{
        let user={
            name:new_name,
            email:"holij@gmail.com",
            phone:"029339488"
        }
        chai.request(app).post("/user/update").set("token",token).send(user)
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.have.property('code').eql(1)
            done()
        })
    })

    it("it should not update user if a field is missing",(done)=>{
        let user={
            name:"Hallenu",
            email:"holij@gmail.com"
        }
        chai.request(app).post("/user/update").set("token",token).send(user)
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.have.property('code').eql(0)
            done()
        })
    })
    
    it("it should not update a user if the user is not authenticated",(done)=>{
        let user={
            name:new_name,
            email:"holij@gmail.com",
            phone:"029339488"
        }
        chai.request(app).post("/user/update").send(user)
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.have.property('code').eql(0)
            done()
        })
    })

    it("check if the user was really updated",(done)=>{
        chai.request(app).get('/user/').set("token",token)
        .end((err,res)=>{
            res.should.have.status(200)
            res.should.be.a('object')
            res.body.should.have.property('code').eql(1)
            res.body.data.should.have.property('name').eql(new_name)
            done();  
        })
    })


});


