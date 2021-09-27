const config = {
    initialForm: document.getElementById("initial-form"),
    mainPage: document.getElementById("mainPage"),
    rate: 1.1
}

class User {
    constructor(name, money, age, day, item) {
        this.name = name;
        this.money = money;
        this.age = age;
        this.day = day;
        this.item = item;
        this.incomeClick = 25;
        this.incomePerSec = 0;
        this.burger = 0;
        this.timer = null;
        this.speed = 1;
    }
}

class Item {
    constructor(name, price, img, type, possession, max, click, second) {
        this.name = name;
        this.price = price;
        this.img = img;
        this.type = type;
        this.possession = possession;
        this.max = max;
        this.click = click;
        this.second = second;
    }
}

class Controller {
    static startGame() {
        config.initialForm.querySelectorAll("#new-game-btn")[0].addEventListener("click", function () {
            Controller.newGame();
        })
        config.initialForm.querySelectorAll("#login-btn")[0].addEventListener("click", function () {
            Controller.login();
        })
    }

    static newGame() {
        let userName = config.initialForm.querySelectorAll(`input[name="userName"]`)[0].value;
        if (userName === "") {
            alert("Please put your name");
            return false;
        }
        let userAccount = Controller.createUserAccount(userName);
        Controller.startUpGame(userAccount);
    }

    static login() {
        let userName = config.initialForm.querySelectorAll(`input[name="userName"]`)[0].value;
        if (userName === "") {
            alert("Please put your name");
            return false;
        }
        if (localStorage.getItem(userName) === null) {
            alert("There is no data.");
            return false;
        }
        let userAccount = JSON.parse(localStorage.getItem(userName))
        Controller.startUpGame(userAccount);
    }

    static startUpGame(userAccount) {
        config.initialForm.classList.add("d-none");
        config.initialForm.querySelectorAll(`input[name="userName"]`)[0].value = null;
        config.mainPage.append(View.mainPage(userAccount));
        Controller.startTimer(userAccount);
    }

    static createUserAccount(userName) {
        let item = [
            new Item("Flip machine", 15000, "https://cdn.pixabay.com/photo/2019/06/30/20/09/grill-4308709_960_720.png", "ability", 0, 500, 25, 0),
            new Item("ETF Stock", 300000, "https://cdn.pixabay.com/photo/2016/03/31/20/51/chart-1296049_960_720.png", "investment", 0, -1, 0, 1),
            new Item("ETF Bonds", 300000, "https://cdn.pixabay.com/photo/2016/03/31/20/51/chart-1296049_960_720.png", "investment", 0, -1, 0, 0.7),
            new Item("Lemonade Stand", 30000, "https://cdn.pixabay.com/photo/2012/04/15/20/36/juice-35236_960_720.png", "realEstate", 0, 1000, 0, 30),
            new Item("Ice Cream Truck", 100000, "https://cdn.pixabay.com/photo/2020/01/30/12/37/ice-cream-4805333_960_720.png", "realEstate", 0, 500, 0, 120),
            new Item("House", 20000000, "https://cdn.pixabay.com/photo/2016/03/31/18/42/home-1294564_960_720.png", "realEstate", 0, 100, 0, 32000),
            new Item("TownHouse", 40000000, "https://cdn.pixabay.com/photo/2019/06/15/22/30/modern-house-4276598_960_720.png", "realEstate", 0, 100, 0, 64000),
            new Item("Mansion", 250000000, "https://cdn.pixabay.com/photo/2017/10/30/20/52/condominium-2903520_960_720.png", "realEstate", 0, 20, 0, 500000),
            new Item("Industrial Space", 1000000000, "https://cdn.pixabay.com/photo/2012/05/07/17/35/factory-48781_960_720.png", "realEstate", 0, 10, 0, 2200000),
            new Item("Hotel Skyscraper", 10000000000, "https://cdn.pixabay.com/photo/2012/05/07/18/03/skyscrapers-48853_960_720.png", "realEstate", 0, 5, 0, 25000000),
            new Item("Bullet-Speed Sky Railway", 100000000000, "https://cdn.pixabay.com/photo/2013/07/13/10/21/train-157027_960_720.png", "realEstate", 0, 1, 0, 30000000000),
            new Item("Galactic Empire", 10000000000000, "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_the_First_Galactic_Empire.svg/1920px-Flag_of_the_First_Galactic_Empire.svg.png", "Empire", 0, 1, 0, 0),
        ];
        if (userName === "cheater") return new User(userName, 100000000, 20, 1, item);
        return new User(userName, 50000, 20, 1, item);
    }

    static gameClear(user) {
        Controller.stopTimer(user);
        let quotations = user.age + " years old Game Clear!!\nStay hungry. Stay foolish."
        alert(quotations);
        config.mainPage.innerHTML = ``;
        config.initialForm.classList.remove("d-none");
    }

    static startTimer(user) {
        user.timer = setInterval(function () {
            user.day++;
            user.age = user.day >= 365 ? 20 + Math.floor(user.day / 365) : 20;
            user.money += user.incomePerSec;

            config.mainPage.querySelectorAll("#header-right")[0].innerHTML = ``;
            config.mainPage.querySelectorAll("#header-right")[0].append(View.userInfoPage(user));
        }, 1000 / user.speed);
    }

    static stopTimer(user) {
        clearTimeout(user.timer);
    }

    static updateMainPage(user) {
        config.mainPage.innerHTML = ``;
        config.mainPage.append(View.mainPage(user));
    }

    static clickBurger(user) {
        user.burger++;
        user.money += user.incomeClick;

        config.mainPage.querySelectorAll("#left")[0].innerHTML = ``;
        config.mainPage.querySelectorAll("#left")[0].append(View.leftPage(user));
        config.mainPage.querySelectorAll("#header-right")[0].innerHTML = ``;
        config.mainPage.querySelectorAll("#header-right")[0].append(View.userInfoPage(user));
    }

    static purchaseItem(user, itemInfo, totalFee, purchaseNumber) {
        if (user.money < totalFee) alert("You don't have enough money.");
        else if (itemInfo.max == itemInfo.possession) alert("You can't buy anymore.");
        else if (purchaseNumber == 0) alert("Invalid Number");
        else {
            user.money -= totalFee;
            user.incomeClick += itemInfo.click * purchaseNumber;
            user.incomePerSec += itemInfo.type === "investment" ? Math.floor(itemInfo.second / 100 * totalFee) : itemInfo.second * purchaseNumber;
            itemInfo.possession += purchaseNumber;
            if (itemInfo.name === "ETF Stock") {
                for (let i = 0; i < purchaseNumber; i++) {
                    itemInfo.price *= config.rate;
                }
            }
            itemInfo.price = Math.floor(itemInfo.price);
        }
    }

    static calculationTotalPrice(itemInfo, purchaseNumber) {
        if (itemInfo.name === "ETF Stock") {
            let price = itemInfo.price;
            let total = 0;
            for (let i = 0; i < purchaseNumber; i++) {
                total += price;
                price *= config.rate;
            }
            return Math.floor(total);
        }
        return itemInfo.price * purchaseNumber;
    }

    static getMaxNum(money, itemInfo, maximumValue) {
        if (itemInfo.name === "ETF Stock") {
            let price = itemInfo.price;
            let count = 0;
            while (money > price) {
                money -= price;
                price *= config.rate;
                count++
            }
            return count;
        }
        return Math.floor(money / itemInfo.price) < maximumValue ? Math.floor(money / itemInfo.price) : maximumValue;
    }

    static reload(user) {
        Controller.stopTimer(user);
        if (confirm("Reset All Data?")) {
            let userName = user.name;
            let userAccount = Controller.createUserAccount(userName);
            Controller.updateMainPage(userAccount);
            Controller.startTimer(userAccount);
        }
        else { Controller.startTimer(user); }
    }

    static save(user) {
        Controller.stopTimer(user);
        user.speed = 1;
        let jsonEncoded = JSON.stringify(user);
        localStorage.setItem(user.name, jsonEncoded);
        alert("Saved your data. Please put the same name when you login.");
        config.mainPage.innerHTML = ``;
        config.initialForm.classList.remove("d-none");
    }

    static adustSpeed(user) {
        let speedRange = [1, 2, 5, 10, 50, 100];
        let i = speedRange.indexOf(user.speed);
        if (i + 1 == speedRange.length) i = -1;
        user.speed = speedRange[i + 1];
        Controller.stopTimer(user);
        Controller.startTimer(user);
        Controller.updateMainPage(user);
    }

    static isValidGameClear(user, itemInfo) {
        if (itemInfo.name === "Galactic Empire" && itemInfo.possession == 1) Controller.gameClear(user);
    }
}


class View {
    static mainPage(user) {
        let main = document.createElement("div");
        main.classList.add("vh-100", "bg-light", "p-2", "p-lg-5", "py-2", "text-center");
        main.innerHTML =
            `
                <header id="header" class="d-block d-sm-flex justify-sm-content-between flex-sm-row-reverse p-1 p-lg-1">
                    <div id="header-left" class="col-sm-3"></div>
                    <div id="header-right" class="col-sm-9"></div>
                </header>
                <div class="d-block d-sm-flex justify-content-center p-0 p-lg-2" id="coalescence">
                    <div class="col-sm-4 p-1 p-lg-2" id="left"></div>
                    <div class="col-sm-8 p-1 p-lg-2" id="right">
                        <div class="overflow-auto mt-lg-3 mt-1" id="menu"></div>
                    </div>
                </div>
            `;
        main.querySelectorAll("#header-left")[0].append(View.configurationPage(user));
        main.querySelectorAll("#header-right")[0].append(View.userInfoPage(user));
        main.querySelectorAll("#left")[0].append(View.leftPage(user));
        main.querySelectorAll("#menu")[0].append(View.menuPage(user));

        return main;
    }

    static userInfoPage(user) {
        let userInfo = document.createElement("div");
        userInfo.classList.add("d-flex", "flex-wrap", "justify-content-center", "p-1");
        userInfo.style.backgroundColor = "#696055";
        userInfo.innerHTML =
            `
                <div class="col-6 col-sm-3 userBorder">
                    <p class="m-0" style="background-color: #f2f0d9">${user.name}</p>
                </div>
                <div class="col-6 col-sm-3 userBorder">
                    <p class="m-0" style="background-color: #f2f0d9">${user.age} years old</p>
                </div>
                <div class="col-6 col-sm-3 userBorder">
                    <p class="m-0" style="background-color: #f2f0d9">${user.day} days</p>
                </div>
                <div class="col-6 col-sm-3 userBorder">
                    <p class="m-0" style="background-color: #f2f0d9">$${user.money}</p>
                </div>
            `
        return userInfo;
    }

    static configurationPage(user) {
        let content = document.createElement("div");
        content.classList.add("d-flex", "justify-content-sm-center", "justify-content-start");
        content.innerHTML =
            `
                <div class="m-1 m-lg-2 hover" id="reload"><i class="fas fa-solid fa-sync"></i></div>
                <div class="m-1 m-lg-2 d-inline-block hover" id="save"><i class="fas fa-solid fa-save"></i></div>
                <div class="m-1 m-lg- 2 hover d-flex align-items-center">
                    <p id="play-speed" class="border text-center border-secondary">${user.speed}x</p>
                </div>
            `;
        content.querySelectorAll("#reload")[0].addEventListener("click", function () { Controller.reload(user); });
        content.querySelectorAll("#save")[0].addEventListener("click", function () { Controller.save(user); });
        content.querySelectorAll("#play-speed")[0].addEventListener("click", function () { Controller.adustSpeed(user); });
        return content
    }

    static leftPage(user) {
        let left = document.createElement("div");
        left.innerHTML =
            `
                <div class="text-center" id="burgerInfo">
                    <h5>${user.burger} Burgers</h5>
                    <p>One click ￥${user.incomeClick}</p>
                </div>
                <div class="burgerImgWrapper hover mt-1 mt-sm-4" id="burgerClick">
                    <img class="burgerImg" src="https://cdn.pixabay.com/photo/2014/04/02/17/00/burger-307648_960_720.png"/>
                </div>
            `;
        left.querySelectorAll("#burgerClick")[0].addEventListener("click", function () { Controller.clickBurger(user) });
        return left;
    }

    static menuPage(user) {
        let menu = document.createElement("div");
        for (let i = 0; i < user.item.length; i++) {
            let item = document.createElement("div");
            item.classList.add("item", "d-flex", "align-items-center", "hover", "m-1");
            item.style.width = "95%";
            let itemInfo = user.item[i];
            item.innerHTML =
                `
                    <div class="itemImg col-sm-3 d-sm-block d-none p-1">
                        <img
                        class="img-fluid"
                        src="${itemInfo.img}"
                        />
                    </div>
                    <div class="itemInfo col-sm-9 col-12 px-3 text-wrap">
                        <div class="d-flex justify-content-between align-items-center pb-3">
                            <p class="itemName col-5 text-start">${itemInfo.name}</p>
                            <p class="purchaseNumber col-5 text-end">${itemInfo.possession}</p>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <p class="itemValue col-5 text-start text-break">¥${itemInfo.price}</p>
                            <p class="income col-5 text-end text-break">¥
                                ${itemInfo.click > 0 ? itemInfo.click + ` / click` : itemInfo.type === "investment" ? itemInfo.second + `% / sec` : itemInfo.second + ` / sec`}
                            </p>
                        </div>
                    </div>
                `;
            item.addEventListener("click", function () {
                config.mainPage.querySelectorAll("#menu")[0].innerHTML = ``;
                config.mainPage.querySelectorAll("#menu")[0].append(View.purchasePage(user, i));
            });
            menu.append(item);
        }
        return menu;
    }

    static purchasePage(user, index) {
        let content = document.createElement("div");
        let itemInfo = user.item[index];

        content.innerHTML =
            `
                <div class="d-block d-sm-flex align-items-center justify-content-between pb-3">
                    <div class="text-start">
                        <h4>${itemInfo.name}</h4>
                        <p class="mb-2">Max purchases: ${itemInfo.max == -1 ? `∞` : itemInfo.max - itemInfo.possession}</p>
                        <p class="mb-2">Price: ￥${itemInfo.price}</p>
                        <p class="mb-2">Get ￥
                            ${itemInfo.click > 0 ? itemInfo.click + ` / click` : itemInfo.type === "investment" ? itemInfo.second + `% / sec` : itemInfo.second + ` / sec`}
                        </p>
                        <p class="mb-2">How many would you like to buy?</p>
                    </div>
                    <div class="col-sm-5">
                        <img src="${itemInfo.img}" style="width:80%"/>
                    </div>
                </div>
                
                <div class="d-flex justify-content-between align-items-center">
                    <div class="col-6 col-sm-10 pe-2 text-start">
                        <input type="number" class="form-control" min="0" value = "0" step = "1" />
                    </div>
                    <div class="col-6 col-sm-2 ps-2">
                        <button class="btn btn-outline-secondary col-10 col-sm-12" id="max-btn">Max</button>
                    </div>
                </div>
                <div class="pt-2 text-end " id="total">
                    <p>total: ￥0</p>
                </div>

                <div class="d-flex justify-content-around pt-2 pt-sm-4">
                    <div class="col-6 col-sm-5 pe-1">
                        <button type="submit" class="btn btn-outline-primary col-12" id="back-btn">Go Back</button>
                    </div>
                    <div class="col-6 col-sm-5 ps-1">
                        <button type="submit" class="btn btn-primary col-12" id="next-btn">Purchase</button>
                    </div>
                </div>
            `;

        let formNumber = content.querySelectorAll("input")[0];
        formNumber.max = itemInfo.max != -1 ? itemInfo.max - itemInfo.possession : Number.MAX_SAFE_INTEGER;
        formNumber.addEventListener("change", function () {
            content.querySelectorAll("#total")[0].innerHTML =
                `
                    <p> total: ￥${Controller.calculationTotalPrice(itemInfo, formNumber.value)}</p>
                `;
        });

        let maxBtn = content.querySelectorAll("#max-btn")[0];
        maxBtn.addEventListener("click", function () {
            formNumber.value = Controller.getMaxNum(user.money, itemInfo, formNumber.max);
            content.querySelectorAll("#total")[0].innerHTML =
                `
                    <p> total: ￥${Controller.calculationTotalPrice(itemInfo, formNumber.value)}</p>
                `;
        });

        let backBtn = content.querySelectorAll("#back-btn")[0];
        backBtn.addEventListener("click", function () {
            config.mainPage.querySelectorAll("#menu")[0].innerHTML = ``;
            config.mainPage.querySelectorAll("#menu")[0].append(View.menuPage(user));
        });

        let nextBtn = content.querySelectorAll("#next-btn")[0];
        nextBtn.addEventListener("click", function () {
            let totalPrice = Controller.calculationTotalPrice(itemInfo, formNumber.value);
            Controller.purchaseItem(user, itemInfo, totalPrice, Number(formNumber.value));
            Controller.updateMainPage(user);
            Controller.isValidGameClear(user, itemInfo);
        });

        return content;
    }
}
Controller.startGame();