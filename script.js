let categories = ['clothes','sport','computers','phones'];
let subcategories = {
    clothes : ['t-shirt', 'pant', 'men\'s jacket'],
    sport : ['ball', 'football uniform', 'football boots'],
    computers : ['ASUS Zenbook', 'Lenovo IdeaPad', 'Apple MacBook Pro'],
    phones : ['Asus Zenfone 8', 'Lenovo K14 Plus', 'iPhone 13 Pro']
};

let $categories = document.getElementById('category');
let $subcategories = document.getElementById('subcategory');
let $products = document.getElementById('product');
let $congratBox = document.getElementById('congrat_box');
let subcategoryItemArray = [];
let $history = document.querySelector('.history');
addElements(categories,$categories,'category','category_item');

let categoriesElementArray = Array.from(document.getElementsByClassName('category_item'));
categoriesElementArray.forEach(function (e) {
    e.addEventListener('click',function(e){
        let categoryName = e.target.dataset.category;
        let categoryItems = Array.from(subcategories[categoryName]);
        if(document.getElementsByClassName('subcategory_item').length > 0){
            $subcategories.innerHTML = '';
        }
        addElements(categoryItems,$subcategories,'product','subcategory_item');
        subcategoryItemArray = Array.from(document.getElementsByClassName('subcategory_item'));
        turnOnProducts();
    })
});

function turnOnProducts(){
    subcategoryItemArray.forEach(function (e) {
        e.addEventListener('click',function (e) {
            $products.innerHTML = '';
            let prdouctElement = document.createElement('p');
            let prdouctBtn = document.createElement('a');
            $products.prepend(prdouctElement);
            $products.append(prdouctBtn);
            prdouctElement.innerText = `Do you want to buy - ${e.target.innerText} ?`;
            prdouctBtn.innerText = 'BUY NOW';
            prdouctBtn.classList.add('buy_btn');
            prdouctBtn.setAttribute(`data-buy`, e.target.innerText);
            turnOnBuyBtn();
        })
    })
}

function turnOnBuyBtn(){
    let buyBtn = document.querySelector('.buy_btn');
    buyBtn.addEventListener('click', function (){
        $congratBox.innerHTML = `<h1>Congratulation! You buy ${buyBtn.dataset.buy}</h1>`;
        addToHistory(`${buyBtn.dataset.buy}`);
        setTimeout(function () {
            $congratBox.innerHTML = '';
            $subcategories.innerHTML = '';
            $products.innerHTML = '';
        },3000)
    });
}

function addElements(array,place,data,className){
    array.forEach(function (e) {
        let categoriesElement = document.createElement('p');
        place.append(categoriesElement);
        categoriesElement.innerText = e;
        categoriesElement.setAttribute(`data-${data}`, e);
        categoriesElement.classList.add(className);
    })
}


// HISTORY BUY PRODUCTS

let historyBtn = document.createElement('div');
historyBtn.innerHTML = `<a href="#" class="history_btn buy_btn">shopping history</a>`
$history.append(historyBtn);

let buyHistory = localStorage.getItem('shopHistory') ? JSON.parse(localStorage.getItem('shopHistory')) : [];

function addToHistory(productName){
    let id = Math.random().toString(36).slice(-8);
    let time = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
    let data = {
        name: productName,
        time: time,
        id: id
    }
    buyHistory.push(data);
    let shopHistory = JSON.stringify(buyHistory);
    localStorage.setItem("shopHistory", shopHistory);
}

document.querySelector('.history_btn.buy_btn').addEventListener('click',function (){
    $categories.innerHTML = '';
    $history.innerHTML = '';
    // document.getElementsByTagName('main')
    getHistoryList();

})

function getHistoryList(){
    if(buyHistory.length < 1){
        let historyBox = document.createElement('div');
        historyBox.innerHTML = `<p>you haven't bought anything before</p>`;
        $history.append(historyBox);
    }else{
        for(let i in buyHistory){
            // console.log(buyHistory[i].name);
            let historyBox = document.createElement('div');
            historyBox.classList.add('history_box');
            let listNum = +i + 1;
            historyBox.innerHTML = `<div class="product_item"><p onclick="showMoreInfo(this)" class="product_item_text"><span>${listNum}.</span>${buyHistory[i].name}</p><p onclick="showMoreInfo(this)" class="product_item_text">${buyHistory[i].time}</p><a data-delete="${buyHistory[i].id}" onclick="removeHistoryItem(this)" class="delete_h_item">delete</a></div>
        <div class="hidden product_info"><p>${buyHistory[i].name} its amazing. Some another intresting things about this product</p></div>`;
            $history.append(historyBox);
        }
    }
}

function removeHistoryItem(e){
    // console.log(e);
    let remItemId = e.dataset.delete;
    // console.log(buyHistory);
    for(let i in buyHistory){
        if(buyHistory[i].id == remItemId){
            buyHistory.splice(+i,1)
        }
    }
    // console.log(buyHistory);
    let shopHistory = JSON.stringify(buyHistory);
    localStorage.setItem("shopHistory", shopHistory);
    $history.innerHTML = '';
    getHistoryList();
}

function showMoreInfo(el) {
    console.log(el.closest('.history_box').lastChild);
    let moreAboutProduct = el.closest('.history_box').lastChild;
    moreAboutProduct.classList.toggle('hidden');
}
