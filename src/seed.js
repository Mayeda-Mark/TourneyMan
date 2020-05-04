const {db, UserInfo} = require ('./models/dbModels');

const seed = async () => {
    await db.sync({force: true});

    const test = await UserInfo.create ({
        UserName: 'test',
        password: 'test123'
    });
    db.close();
    console.log('Seed Successful!');
}
seed();

const findUser = async () => {
    try {
        const allUsers = await UserInfo.findAll();
        console.log(allUsers);
    } catch (error) {
        next(error);
    }
}

findUser();