const express = require('express')
const app = express()
const Gdax = require('gdax');
const publicClient = new Gdax.PublicClient();

app.get('/', (req, res) => {

    const orderbookSync = new Gdax.OrderbookSync(['BTC-USD']);
    let currentPrice = publicClient.getProductTicker('BTC-USD', function(err, response, data){
	function roundDown(number, decimals) {
	    decimals = decimals || 0;
	    return ( Math.floor( number * Math.pow(10, decimals) ) / Math.pow(10, decimals) );
	}
	let currentPrice =  Number(data.price);
	let book = {};
	setTimeout(function() {
	    book["buys"] = orderbookSync.books['BTC-USD'].state().bids.reduce(function(seed, price) {
		let number = roundDown(Number(price.price), -1)
		if (currentPrice - 500 <= number && number < currentPrice || currentPrice + 500 >= number && number > currentPrice) {
		    seed[number] = seed[number] ? String(Number(seed[number].split(" ")[0]) + 1) + " " +  String((Number(seed[number].split(" ")[1]) + Number(price.size)).toFixed(2)) : "1" + " " + String(Number(price.size).toFixed(2))
                    if (Number(price.size) >= 15) {
			seed["largeOrders"] = seed["largeOrders"] ? seed["largeOrders"] : {};
			seed["largeOrders"][price.id] = price
		    }
		}
	
	    
	    return seed;
	    }, {});
	    book["sells"] = orderbookSync.books['BTC-USD'].state().asks.reduce(function(seed, price) {
		let number = Math.round(Number(price.price) / 10) * 10;
		if (currentPrice - 500 <= number && number < currentPrice || currentPrice + 500 >= number && number > currentPrice) {
		    seed[number] = seed[number] ? String(Number(seed[number].split(" ")[0]) + 1) + " " +  String((Number(seed[number].split(" ")[1]) + Number(price.size)).toFixed(2)) : "1" + " " + String(Number(price.size).toFixed(2))
		    if (Number(price.size) >= 15) {
			seed["largeOrders"] = seed["largeOrders"] ? seed["largeOrders"] : {};
			seed["largeOrders"][price.id] = price
		    }
		}
		return seed;
	    }, {});
	    res.send(book)
	}, 5000);
/*	setTimeout(function() { console.log(orderbookSync.books['BTC-USD'].state().asks.reduce(function(seed, price) {
	    let number = Math.round(Number(price.price) / 10) * 10;
	    if (currentPrice - 250 <= number && number < currentPrice || currentPrice + 250 >= number && number > currentPrice) {
		seed[number] = seed[number] ? seed[number] + 1 : 1;
	    }
	    return seed;
	}, {}));
			      }, 5000); */
    })
})

app.listen(process.env.PORT || 3000);



						 
