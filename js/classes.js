class Hero {
    constructor(c, name, lvl, str, agi, int, hp) {
        this.class = c;
        this.name = name;
        this.lvl = +lvl;
        this.str = +str;
        this.int = +int;
        this.agi = +agi;
        this.hp = +hp;
    }

    countStats() {
        let statsSum = 0;
        statsSum += this.str;
        statsSum += this.agi;
        statsSum += this.int;
        statsSum += this.hp;

        return statsSum;
    }
}

class Mage extends Hero {
    constructor(c, name, lvl, str, agi, hp, int, mana, hasTectonicPotion) {
        super(c, name, lvl, str, agi, hp, int);
        this.hasTectonicPotion = hasTectonicPotion;
        this.mana = +mana;
    }
    healHero() {
        if (this.mana > 10) {
            const healAmount = this.lvl * 5;
            this.hp += healAmount;
            this.mana -= healAmount + 10 / this.lvl;
            if (this.hasTectonicPotion && this.mana > 35) {
                this.hasTectonicPotion = false;
                this.hp += 100;
                this.mana -= 35;
            }
        }
    }
}

class Knight extends Hero {
    constructor(c, name, lvl, str, agi, hp, int, energy, isHorseTango) {
        super(c, name, lvl, str, agi, hp, int);
        this.isHorseTango = isHorseTango;
        this.energy = energy;
    }
    gainAgility() {
        if (this.energy > 10) {
            const gainAmount = (this.lvl * this.energy) / 30;
            this.agi += gainAmount | 0;
            const energyAmount = (gainAmount * 10) / this.lvl;
            this.energy -= energyAmount;
            if (this.isHorseTango && this.energy > 50) {
                this.hasTectonicPotion = false;
                this.agi += 140;
                this.energy -= 50;
            }
        }
    }
}
