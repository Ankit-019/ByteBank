'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// OUR CODE

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; //to empty the earlier hard coded data

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //template literals
    const html = `<div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type} </div>
                <div class="movements__value">${mov}€</div>
               </div>
             `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, curr) {
    return acc + curr;
  }, 0);

  labelBalance.textContent = `${acc.balance} €`;
};

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};

createUsernames(accounts);

// console.log(accounts);

const calcDisplaySummary = function (ac) {
  const incomes = ac.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);

  labelSumIn.textContent = `${incomes}€`;

  const oout = ac.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, curr) {
      return acc + curr;
    });

  labelSumOut.textContent = `${oout}€`;

  //interest will only be paid if more than or equal 1
  const interests = ac.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (depo) {
      return (depo * ac.interestRate) / 100;
    })
    .filter(function (int, i, arr) {
      // console.log(arr);
      return int >= 1;
    })
    .reduce(function (acc, int) {
      return acc + int;
    }, 0);

  labelSumInterest.textContent = `${interests}€`;
};

// console.log(accounts);

//Updating UI
const updateUI = function (acc) {
  displayMovements(acc.movements);

  //Display balance
  calcDisplayBalance(acc);

  //display summary

  calcDisplaySummary(acc);
};

const account = accounts.find(function (acc) {
  return acc.owner === 'Jessica Davis';
});

// console.log(account);

let currentAccount;

///EVENT HANDLER
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();
  // console.log('LOGIN');

  //finding the account using usernamem
  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });

  console.log(currentAccount);

  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome back,${currentAccount.owner.split(' ')[0]}`;

    containerApp.style.opacity = 100;

    //Clearing the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);

    // console.log('LOGIN');
  }
});

//TRANSFER MONEY
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value,
  );
  console.log(amount, receiverAcc);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // console.log(`Transferred ${amount} to ${receiverAcc.owner} and your current balance is ${(currentAccount.balance - amount)}`);

    //performing transfer

    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

//closing a account using findIndex method

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // console.log('Delete');

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // const index=accounts.findIndex(acc=>acc.username===currentAccount.username);

    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });
    console.log(index);

    //delete account
    accounts.splice(index, 1);

    // //Hide Ui
    containerApp.style.opacity = 0;

    // console.log(accounts);
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // console.log('Loan granted');
    //ADD AMOUNT TO MOVEMETS
    currentAccount.movements.push(amount);

    //update UI
    updateUI(currentAccount);
  }
});

const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
const allMovements = accountMovements.flat();
console.log(allMovements);

const overalBalance = allMovements.reduce(function (acc, mov) {
  return acc + mov;
}, 0);
console.log(overalBalance);

const overallBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

///LECTURE 28

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', '')),
  );
  console.log(movementsUI);
});



//LEcture 29

//Non-destructive alternatives : toReversed,toSorted,toSpliced,with

const movements= [200, -200, 340, -300, -20, 50, 400, -460];
console.log(movements);
// const reversedMov=movements.reverse();//this changes the actual movements array also so it is a destructive method

const reversedMov=movements.toReversed();//keeps the original array same
console.log(reversedMov);
console.log(movements);

//toSorted(sort), toSpliced(splice)

const sortedMov=movements.toSorted();
console.log(sortedMov);

const slicedMov = movements.toSpliced();
console.log(slicedMov);

console.log(movements);


//CHANGING ELEMENTS

// movements[1]=2000;//mutated the ACTUAL ARRAY
// console.log(movements);

const newMovements = movements.with(1,2000);
console.log(newMovements);
console.log('Movements:',movements);