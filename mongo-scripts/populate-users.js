db.users.insertMany([
    {
        firstName: 'Overlord',
        lastName: 'Smith',
        email: 'bigboss@historynow.com',
        username: 'admin',
        userPassword: '1234',
        isAdmin: true
    },
    {
        firstName: 'Randy',
        lastName: 'Lahey',
        email: 'coreytrevor@sunnyvale.com',
        username: 'randy',
        userPassword: 'iamtheliquer',
        isAdmin: false,
        savedEvents: []
    }
])