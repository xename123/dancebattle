"use strict";

// Получаем все нужные элементы страницы
const addHeroButton = document.getElementById("sendToBattleButton");
const addEnemyButton = document.getElementById("getEnemyButton");
const doSkillButton = document.getElementById("doSkillButton");
const startBattleButton = document.getElementById("startBattleButton");
const battleLog = document.getElementById("battleLog");

// Создаем идентификаторы персонажей
let playerHero = null;
let enemyHero = null;
let winner = null;

// Функция задержки
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Функция, выдающая случайную цифру
function getRandom(length) {
    return Math.floor(Math.random() * length);
}

// Вешаем событие клика на кнопку формы
addHeroButton.addEventListener("click", (e) => {
    // Проверяем форму на наличие ошибок
    const form = e.target.closest("#heroForm");
    const errors = validateForm(form);
    if (errors) {
        alert("Введите все поля формы");
        return;
    }
    // Получаем карточку пользователя
    const playerCard = document.getElementById("playerCard");

    // Получаем данные с формы
    const formData = new FormData(form);
    const heroClass = formData.get("class");
    const commonProperties = [
        heroClass,
        formData.get("name"),
        formData.get("level"),
        formData.get("strength"),
        formData.get("agility"),
        formData.get("intelligence"),
        100,
        formData.get("additionalStat"),
        formData.get("additionalAbility"),
    ];
    // Узнаем класс и в зависимости от него формируем объект персонажа пользователя
    if (heroClass === "Mage") {
        playerHero = new Mage(...commonProperties);
    } else if (heroClass === "Knight") {
        playerHero = new Knight(...commonProperties);
    }
    // Выводим карточку персонажа
    displayHero(playerCard, playerHero);

    // Убираем disable у кнопок
    addEnemyButton.removeAttribute("disabled");
    doSkillButton.removeAttribute("disabled");
});
doSkillButton.addEventListener("click", () => {
    // Вызываем дополнительный метод у персонажа, который повышает его характеристики
    const playerCard = document.getElementById("playerCard");
    const playerClass = playerHero.class;
    if (playerClass === "Mage") {
        playerHero.healHero();
    } else {
        playerHero.gainAgility();
    }
    // Выводим обновленную карточку
    displayHero(playerCard, playerHero);
});
addEnemyButton.addEventListener("click", async () => {
    // Получаем карточку соперника
    const enemyCard = document.getElementById("enemyCard");
    const enemyHeroesArray = await getEnemyHeroes();
    const randomEnemy = enemyHeroesArray[getRandom(enemyHeroesArray.length)];
    enemyHero = new Hero(
        "Новичок",
        randomEnemy.title,
        10,
        randomEnemy.str,
        randomEnemy.agi,
        randomEnemy.int,
        100
    );
    // Выводим карточку соперника
    displayHero(enemyCard, enemyHero);
    startBattleButton.removeAttribute("disabled");
});
startBattleButton.addEventListener("click", () => {
    // Вызываем функцию сражения
    arena(playerHero, enemyHero);
});

async function arena(player, enemy) {
    // Запрещаем нажимать на кнопки, чтобы избежать повторного вызова функции
    addEnemyButton.setAttribute("disabled", true);
    doSkillButton.setAttribute("disabled", true);
    startBattleButton.setAttribute("disabled", true);

    // Получаем карточки
    const playerCardEl = document.getElementById("playerCard");
    const enemyCardEl = document.getElementById("enemyCard");

    // Убираем классы после определения победителя, если он есть
    if (winner) {
        document.body.classList.remove("_show-winner");
        playerCardEl.classList.remove("_win");
        enemyCardEl.classList.remove("_win");
    }

    // Выводим в отдельное окно уведомление о начале сражения
    battleLog.insertAdjacentHTML(
        "beforeend",
        `<h6>Да начнётся танцевальный баттл между ${player.name} и ${enemy.name}!</h6>`
    );
    // Создаем идентификатор победителя

    await delay(1000).then(() => {
        // Ждем секунду, производим вычисления
        let playerSum = player.countStats();
        let enemySum = enemy.countStats();
        // Выводим их
        battleLog.insertAdjacentHTML(
            "beforeend",
            `<p>Сумма значений параметров первого героя: ${playerSum}</p>`
        );
        battleLog.insertAdjacentHTML(
            "beforeend",
            `<p>Сумма значений параметров второго  героя:  ${enemySum}</p>`
        );
        // Определяем победителя
        if (playerSum > enemySum) {
            // Добавляем анимацию удара
            enemyCardEl.classList.add("_damage");
            setTimeout(() => {
                playerCardEl.classList.add("_damage");
            }, 700);
            winner = [player, playerCardEl];
        } else if (enemySum > playerSum) {
            // Добавляем анимацию удара
            playerCardEl.classList.add("_damage");
            setTimeout(() => {
                enemyCardEl.classList.add("_damage");
            }, 700);
            winner = [enemy, enemyCardEl];
        }
    });
    await delay(2000).then(() => {
        // Выводим сообщение с победителем через 2 секунды
        if (winner[0]) {
            battleLog.insertAdjacentHTML(
                "beforeend",
                `<h4>Ритмично чествуем победителя:  ${winner[0].name}</h4>`
            );
        } else {
            battleLog.insertAdjacentHTML(
                "beforeend",
                `<h4>В танцевальном баттле победила дружба!</h4>`
            );
        }
    });
    celebrateWinner(winner[1]);
    // Убираем ограничения с кнопок
    addEnemyButton.removeAttribute("disabled");
    doSkillButton.removeAttribute("disabled");
    startBattleButton.removeAttribute("disabled");
    // Убираем вспомогательные классы с карточек
    playerCardEl.classList.remove("_damage");
    enemyCardEl.classList.remove("_damage");
}
// Получаем карточку соперника с сервера
async function getEnemyHeroes() {
    return await fetch("https://api-code.practicum-team.ru/heroes")
        .then((response) => response.json())
        .then((data) => data)
        .catch((e) => console.log(e));
}
// Функция валидации формы
function validateForm(form) {
    const requiredItems = form.querySelectorAll("[data-required]");

    let errors = 0;
    [...requiredItems].map((item) => {
        if (
            (item.type === "text" || item.type === "number") &&
            item.value === ""
        ) {
            errors++;
            return;
        }
        if (item.type === "number") {
            const maxValue = +item.max;
            const minValue = +item.min;
            if (maxValue && item.value > maxValue) {
                item.value = maxValue;
            }
            if (minValue && item.value < minValue) {
                item.value = minValue;
            }
        }
    });
    return errors;
}
// Функция вывода данных
function displayHero(curCard, curHero) {
    const properties = ["class", "name", "lvl", "str", "agi", "int", "hp"];

    properties.forEach((property) => {
        const cardElement = curCard.querySelector(
            `#hero${property.charAt(0).toUpperCase() + property.slice(1)}`
        );

        cardElement.innerText = curHero[property];
    });
}

function celebrateWinner(winCard) {
    document.body.classList.add("_show-winner");
    winCard.classList.add("_win");
}
