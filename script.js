

"use strict";

// Birthday: 4 January 2027, midnight Indian Standard Time
const birthdayDate = new Date("2027-01-04T00:00:00+05:30").getTime();

const $ = (id) => document.getElementById(id);

const countdownArea = $("countdownArea");
const birthdayMessage = $("birthdayMessage");
const lockedContent = $("lockedContent");
const unlockedContent = $("unlockedContent");

function unlockBirthday() {
  countdownArea.classList.add("hidden");
  birthdayMessage.classList.remove("hidden");
  lockedContent.classList.add("hidden");
  unlockedContent.classList.remove("hidden");

  renderWishes();
}

function updateCountdown() {
     
//     unlockBirthday();
// return;
  const remaining = birthdayDate - Date.now();

  if (remaining <= 0) {
    $("days").textContent = "00";
    $("hours").textContent = "00";
    $("minutes").textContent = "00";
    $("seconds").textContent = "00";

    unlockBirthday();
    return;
  }

  $("days").textContent = String(
    Math.floor(remaining / (1000 * 60 * 60 * 24))
  ).padStart(2, "0");

  $("hours").textContent = String(
    Math.floor((remaining / (1000 * 60 * 60)) % 24)
  ).padStart(2, "0");

  $("minutes").textContent = String(
    Math.floor((remaining / (1000 * 60)) % 60)
  ).padStart(2, "0");

  $("seconds").textContent = String(
    Math.floor((remaining / 1000) % 60)
  ).padStart(2, "0");
}

// Local demo storage. Shared online wishes need a database.
function getWishes() {
  try {
    const saved = localStorage.getItem("ranjanaBirthdayWishes");
    const wishes = saved ? JSON.parse(saved) : [];
    return Array.isArray(wishes) ? wishes : [];
  } catch (error) {
    console.error("Could not read saved wishes:", error);
    return [];
  }
}

function renderWishes() {
  const list = $("wishesList");
  const status = $("birthdayWishesStatus");
  const wishes = getWishes();

  list.replaceChildren();

  if (wishes.length === 0) {
    status.textContent =
      "No wishes yet. Be the first to leave a little love! ♡";
    return;
  }

  wishes.forEach((wish) => {
    const card = document.createElement("article");
    card.className = "wish-card";

    const message = document.createElement("p");
    message.textContent = wish.message;

    const sender = document.createElement("strong");
    sender.textContent = "— " + wish.name;

    card.append(message, sender);
    list.appendChild(card);
  });

  status.textContent =
    `${wishes.length} beautiful wish${wishes.length === 1 ? "" : "es"} ✦`;
}

$("wishForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $("senderName").value.trim();
  const message = $("wishMessage").value.trim();
  const status = $("formStatus");

  if (!name || !message) {
    status.textContent = "Please enter your name and birthday wish.";
    return;
  }

  const wishes = getWishes();

  wishes.push({
    name: name.slice(0, 50),
    message: message.slice(0, 500)
  });

  try {
    localStorage.setItem("ranjanaBirthdayWishes", JSON.stringify(wishes));

    $("wishForm").reset();
    status.textContent = "Your wish has been saved on this device. ♡";

    if (Date.now() >= birthdayDate) {
      renderWishes();
    }
  } catch (error) {
    console.error("Could not save wish:", error);
    status.textContent = "Could not save the wish in this browser.";
  }
});

updateCountdown();
setInterval(updateCountdown, 1000);

if (Date.now() >= birthdayDate) {
  unlockBirthday();
}
