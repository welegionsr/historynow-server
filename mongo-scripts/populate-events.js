db.events.insertMany([
    {
        typeOfEvent: 1,
        country: 'Old Africa',
        price: 4000,
        dateInTime: "50,000 BC",
        date: new Date(2019, 7, 28),
        title: 'The discovery of fire',
        description: 'Want to be there when the first man discovred fire? Now you can!',
        eraName: 'prehistoric',
        imageUrl: 'https://factsnfun.com/wp-content/uploads/2017/06/Facts-about-fire-discovery.jpg'
    },
    {
        typeOfEvent: 1,
        country: 'Old Asia',
        price: 5500,
        dateInTime: "10,000 BC",
        date: new Date(2019, 8, 21),
        title: 'Sabertooths vs a Mammoth',
        description: 'I mean, who wouldn\'t want to see that? Two extinct behemoths battling it out!',
        eraName: 'prehistoric',
        imageUrl: 'http://3.bp.blogspot.com/_u8RzBC9dWv0/S8z17UwLxlI/AAAAAAAAClw/HuX2FnlOBQY/s400/Mammoth+and+sabertooth.jpg'
    }
])