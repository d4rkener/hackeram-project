import '../scss/styles.scss';
import axios from 'axios';

// Variables
const ageInput = document.getElementById('ageInput');
const genderInput = document.getElementById('genderInput');
const symptomForm = document.getElementById('symptomForm');
const symptomInput = document.getElementById('symptomInput');
const messageContainer = document.getElementById('messageContainer');
const ageForm = document.getElementById('ageform');
const genderForm = document.getElementById('genderForm');
let userAge = 0;
let userGender = '';

// Functions
const outputResult = (data) => {
  let html = `<div class="chat__messages--message">
  <p>I think you have the following diseases</p>
</div>`;

  data.conditions.forEach((condition) => {
    html += `
    <div class="chat__messages--message" id="${condition.id}">
      <p>${condition.name}</p>
    </div>
    `;
  });

  messageContainer.innerHTML = html;
};

const sendUserDetails = async (userDetails) => {
  const res = await axios.post(
    'https://api.infermedica.com/v3/diagnosis',
    userDetails,
    {
      headers: {
        'Content-Type': 'application/json',
        'App-Id': import.meta.env.VITE_APP_ID,
        'App-Key': import.meta.env.VITE_APP_KEY,
      },
    },
  );

  const data = await res.data;

  outputResult(data);
};

const getSymptom = async (symptom, age, gender) => {
  const res = await axios.post(
    'https://api.infermedica.com/v3/parse',
    {
      text: symptom,
      age: {
        value: age,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'App-Id': import.meta.env.VITE_APP_ID,
        'App-Key': import.meta.env.VITE_APP_KEY,
      },
    },
  );

  const data = await res.data.mentions;

  let userSymptoms = [];

  data.forEach((symptom) => {
    let obj = {
      choice_id: symptom.choice_id,
      id: symptom.id,
      source: 'initial',
    };

    userSymptoms.push(obj);
  });

  const userDetails = {
    sex: gender,
    age: {
      value: age,
    },
    evidence: userSymptoms,
  };

  sendUserDetails(userDetails);
};

const outputGender = () => {
  ageForm.classList.add('hide');
  genderForm.classList.remove('hide');

  let html = `
    <div class="chat__messages--message">
      <p>Great!! Now tell me your gender</p>
    </div>
  `;

  messageContainer.innerHTML = html;
};

const outputSymptom = () => {
  genderForm.classList.add('hide');
  symptomForm.classList.remove('hide');

  let html = `
    <div class="chat__messages--message">
      <p>Now, tell me your symptoms (problems)</p>
    </div>
  `;

  messageContainer.innerHTML = html;
};

const submitAgeForm = (e) => {
  e.preventDefault();

  let html = ``;

  html += `
  <div class="chat__messages--message right">
    <p>${ageInput.value.trim()}</p>
  </div>
  `;

  messageContainer.innerHTML += html;

  const age = Number(ageInput.value.trim());

  userAge = age;

  ageInput.value = '';

  setTimeout(() => {
    outputGender();
  }, 600);
};

const submitGenderForm = (e) => {
  e.preventDefault();

  let html = ``;

  html += `
  <div class="chat__messages--message right">
    <p>${genderInput.value.trim()}</p>
  </div>
  `;

  messageContainer.innerHTML += html;

  const gender = genderInput.value.trim();

  userGender = gender;

  genderInput.value = '';

  setTimeout(() => {
    outputSymptom();
  }, 600);
};

const submitSymptomForm = (e) => {
  e.preventDefault();

  let html = ``;

  html += `
  <div class="chat__messages--message right">
    <p>${symptomInput.value.trim()}</p>
  </div>
  `;

  messageContainer.innerHTML += html;

  getSymptom(symptomInput.value, userAge, userGender);

  symptomInput.value = '';
};

// Event Listeners
ageForm.addEventListener('submit', submitAgeForm);
genderForm.addEventListener('submit', submitGenderForm);
symptomForm.addEventListener('submit', submitSymptomForm);
