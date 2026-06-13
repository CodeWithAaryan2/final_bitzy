// ============================================================
// SUB AI BRAIN — No API, Pure local knowledge engine
// ============================================================

export interface SubAIResponse {
  text: string;
  confidence: number;
}

// ── DETECT LANGUAGE ──────────────────────────────────────────
const HINDI_WORDS = ['kya','kaise','karo','bhai','yaar','hai','hain','mein','ka','ki','ke','nahi','hota','karta','karein','batao','samjhao','explain','sikhna','puch','dobara','theek','acha','bilkul','bahut','thoda','zyada','abhi','pehle','baad','aur','lekin','toh','matlab','seedha','sab','kuch','hoga','dost','tera','mera','apna'];

export function detectLang(text: string): 'hinglish' | 'english' {
  const words = text.toLowerCase().split(/\s+/);
  const hindiCount = words.filter(w => HINDI_WORDS.includes(w)).length;
  return hindiCount >= 1 ? 'hinglish' : 'english';
}

// ── KNOWLEDGE BASE ────────────────────────────────────────────
const KB: Record<string, { keys: string[]; en: string; hi: string }> = {

  // ── BITZY APP ──────────────────────────────────────────────
  xp: {
    keys: ['xp','experience','point','score','earn xp','xp kaise','level up','xp system'],
    en: `**XP (Experience Points)** — yeh Bitzy ka main currency hai! 🎯

**How to earn XP:**
• ✅ Complete a lesson → **+25 XP**
• 📝 Complete a quiz → **+50 XP**
• ⚡ Solve an Arena challenge → **+75 XP**
• 🔥 Daily streak bonus → **+10 XP per day**

**Level System:**
• Level 1 → Level 2 needs 100 XP
• Each level needs 100 more XP than the previous
• Higher level = more respect on Leaderboard!

**Pro tip:** Arena challenges give the most XP. Solve 1 challenge = 3 lessons worth of XP! 🚀`,
    hi: `**XP (Experience Points)** — yeh Bitzy ka sabse important cheez hai! 🎯

**XP kaise kamao:**
• ✅ Lesson complete karo → **+25 XP**
• 📝 Quiz complete karo → **+50 XP**
• ⚡ Arena challenge solve karo → **+75 XP**
• 🔥 Daily streak → **+10 XP har din**

**Level System:**
• Level 1 se Level 2 ke liye 100 XP chahiye
• Har level pe 100 zyada XP lagte hain
• Jitna zyada level, leaderboard pe utni izzat! 😎

**Pro tip bhai:** Arena challenges mein sabse zyada XP milta hai. 1 challenge = 3 lessons ka XP! 🚀`
  },

  energy: {
    keys: ['energy','heart','hearts','life','lives','energy kya','hearts kya','energy kaise','refill'],
    en: `**Energy / Hearts System** ⚡

Energy is your "fuel" in Bitzy. You need it to:
• 📖 Open and complete lessons
• 💡 Use hints in Arena
• ▶️ Run code in challenges

**Rules:**
• You start with **5 energy**
• Each action costs **1 energy**
• Energy **auto-refills over time** (1 per hour)
• When energy = 0, wait for refill or come back later

**Tips:**
• Plan your sessions — don't waste energy on easy stuff
• Morning mein fresh energy hoti hai!
• Focus on hardest topics when energy is full`,
    hi: `**Energy / Hearts System** ⚡

Energy matlab Bitzy mein tumhara "fuel" — iske bina kuch nahi hoga!

**Energy kab lagti hai:**
• 📖 Lesson kholne pe
• 💡 Arena mein hint use karne pe
• ▶️ Code run karne pe

**Rules:**
• Shuru mein **5 energy** milti hai
• Har action mein **1 energy** jati hai
• Energy **khud se refill** hoti hai — 1 per hour
• Jab 0 ho jaye, thoda wait karo ya kal aao 😄

**Tip yaar:** Jab puri energy ho tab mushkil topics karo — easy cheezein baad mein!`
  },

  streak: {
    keys: ['streak','streaks','daily','login streak','fire','365','consecutive','din'],
    en: `**Streak System** 🔥

A streak = how many days in a row you've logged into Bitzy!

**Streak Rewards:**
• 3-day streak → 🎁 Bonus coins + badge
• 7-day streak → 🏆 Special badge + XP boost
• 30-day streak → 💎 Rare badge!

**How to keep your streak:**
1. Login every single day (even for 5 mins)
2. Complete at least 1 lesson/quiz
3. Midnight reset — so login before 12am!

**Streak broke? Don't worry!** Start again — consistency is what matters. The best coders code every day! 💪`,
    hi: `**Streak System** 🔥

Streak = kitne din se lagaataar Bitzy use kar rahe ho!

**Streak pe kya milega:**
• 3 din ka streak → 🎁 Bonus coins + badge
• 7 din ka streak → 🏆 Special badge + XP boost
• 30 din ka streak → 💎 Rare badge!

**Streak kaise bachao:**
1. Har din login karo (5 minute bhi chalega)
2. Kam se kam 1 lesson ya quiz karo
3. Midnight pe reset hoti hai — 12 baje se pehle karo!

**Bhai streak toot gayi?** Koi baat nahi! Firse shuru karo — ek baar habit ban gayi toh rok nahi sakte! 💪`
  },

  coins: {
    keys: ['coin','coins','gem','gems','currency','shop','buy','purchase','paisa'],
    en: `**Coins & Gems** 💰

Coins are Bitzy's reward currency!

**Earn coins:**
• Complete lesson → **+10 coins**
• Complete quiz → **+15 coins**
• Solve Arena challenge → **+30 coins**
• Daily streak bonus → extra coins!

**Use coins for:**
• 🛍️ Future shop items (coming soon!)
• 🏆 Unlocking special content
• Showing off your wealth on profile 😄

**Tip:** Coins don't expire — keep earning and save up!`,
    hi: `**Coins & Gems** 💰

Coins = Bitzy ki apni currency bhai!

**Coins kaise milenge:**
• Lesson complete → **+10 coins**
• Quiz complete → **+15 coins**
• Arena challenge → **+30 coins**
• Daily streak pe bonus!

**Coins ka use:**
• 🛍️ Future shop items (jaldi aa raha hai!)
• 🏆 Special content unlock
• Profile pe flex karo 😄

Bhai coins kabhi expire nahi hote — kamao aur save karo!`
  },

  badges: {
    keys: ['badge','badges','achievement','achievements','unlock','trophy','reward','medal'],
    en: `**Badges & Achievements** 🏅

Badges are special rewards you unlock by hitting milestones!

**Types of badges:**
• 🎓 **Learning badges** — Complete X lessons
• ⚡ **Arena badges** — Solve X challenges
• 🔥 **Streak badges** — 3, 7, 30 day streaks
• 📈 **Level badges** — Reach Level 5, 10, 20...
• 🏆 **Special badges** — Rare, secret achievements

**How to see your badges:**
Go to **Profile → Badges** section

**Tips to unlock fast:**
1. Do lessons daily for streak badges
2. Arena challenges for combat badges
3. Level up consistently for level badges

Show them off — they're your coding trophies! 🏆`,
    hi: `**Badges & Achievements** 🏅

Badges = tumhari coding trophies! Milestones hit karo, badges unlock karo!

**Badge types:**
• 🎓 **Learning badges** — X lessons complete karo
• ⚡ **Arena badges** — X challenges solve karo
• 🔥 **Streak badges** — 3, 7, 30 din ke streaks
• 📈 **Level badges** — Level 5, 10, 20 reach karo
• 🏆 **Special badges** — Rare aur secret wale!

**Badges kahan dekhein:**
**Profile → Badges** section mein jao

**Jaldi unlock karne ke tips:**
1. Roz lessons karo streak badges ke liye
2. Arena challenges karo combat badges ke liye
3. Consistently level up karte raho

Inhe dikhao yaar — yeh sab tumhari mehnat ka saboot hai! 💪`
  },

  courses: {
    keys: ['course','courses','curriculum','syllabus','learn','sikhna','konsa course','beginner','start','shuru'],
    en: `**Bitzy Courses** 📚

We have courses for every level!

**Beginner Path (Start here!):**
1. 🌐 **HTML** — Building web pages
2. 🎨 **CSS** — Making things beautiful
3. ⚡ **JavaScript** — Making things interactive
4. 🐍 **Python** — Great for logic & AI

**Intermediate:**
5. 🔧 **Git** — Version control (must know!)
6. 📘 **TypeScript** — JavaScript with superpowers
7. 🗄️ **SQL** — Databases & data management

**Advanced:**
8. ⚛️ **React** — Modern web apps
9. 🟢 **Node.js** — Backend development
10. 🔣 **Data Structures** — Algorithms & logic

**Recommended path for absolute beginners:**
HTML → CSS → JavaScript → Python → Git`,
    hi: `**Bitzy Courses** 📚

Har level ke liye courses hain bhai!

**Beginner Path (Yahan se shuru karo!):**
1. 🌐 **HTML** — Web pages banana
2. 🎨 **CSS** — Cheezein sundar banana
3. ⚡ **JavaScript** — Cheezein interactive banana
4. 🐍 **Python** — Logic aur AI ke liye

**Intermediate:**
5. 🔧 **Git** — Version control (zaroor seekho!)
6. 📘 **TypeScript** — JavaScript ka bada bhai
7. 🗄️ **SQL** — Databases manage karna

**Advanced:**
8. ⚛️ **React** — Modern web apps
9. 🟢 **Node.js** — Backend development
10. 🔣 **Data Structures** — Algorithms & logic

**Bilkul beginner ho? Yeh path follow karo:**
HTML → CSS → JavaScript → Python → Git`
  },

  arena: {
    keys: ['arena','challenge','challenges','problem','solve','competitive','coding challenge','arena kya'],
    en: `**Arena — Coding Challenges** ⚔️

Arena is where you test your real coding skills!

**How it works:**
1. Choose a challenge (Easy/Medium/Hard)
2. Read the problem statement
3. Write your solution in the code editor
4. Run tests to check your answer
5. Submit when all tests pass!

**Rewards per challenge:**
• Easy → **+30 XP, +15 coins**
• Medium → **+50 XP, +25 coins**
• Hard → **+75 XP, +40 coins**

**Hints system:**
• Each hint costs 1 energy
• Use wisely — try yourself first!

**Tips to solve faster:**
1. Read problem twice before coding
2. Write pseudocode first
3. Test with simple examples
4. Use hints only when truly stuck`,
    hi: `**Arena — Coding Challenges** ⚔️

Arena mein apni real coding skills test karo!

**Kaise kaam karta hai:**
1. Challenge choose karo (Easy/Medium/Hard)
2. Problem padho
3. Code editor mein solution likho
4. Tests run karo
5. Sab pass ho jaye toh submit karo!

**Rewards:**
• Easy → **+30 XP, +15 coins**
• Medium → **+50 XP, +25 coins**
• Hard → **+75 XP, +40 coins**

**Hints:**
• Har hint mein 1 energy lagti hai
• Pehle khud try karo bhai!

**Tips:**
1. Problem do baar padho pehle
2. Pehle pseudocode likho
3. Simple examples se test karo
4. Hint sirf jab bilkul nahi samjhe`
  },

  games: {
    keys: ['game','games','play','quiz game','speed typing','bug hunt','memory','code battle','mini game'],
    en: `**Bitzy Games** 🎮

Fun games to reinforce your coding skills!

**Available Games:**
• 🧠 **Code Quiz** — Answer coding MCQs, earn XP fast
• ⌨️ **Speed Typing** — Type code faster, improve accuracy
• 🐛 **Bug Hunt** — Find the bug in broken code
• 🧩 **Memory Match** — Match code terms to definitions
• ⚔️ **Code Battle** — PvP-style coding challenges
• 🔮 **Code Prediction** — Predict code output
• 📝 **Fill in the Blank** — Complete the missing code

**Best games for beginners:** Code Quiz + Memory Match
**Best for practice:** Bug Hunt + Fill in the Blank
**Most XP:** Code Battle + Code Quiz`,
    hi: `**Bitzy Games** 🎮

Fun games se coding skills strong karo!

**Available Games:**
• 🧠 **Code Quiz** — Coding MCQs, fast XP
• ⌨️ **Speed Typing** — Tez type karo, accuracy badho
• 🐛 **Bug Hunt** — Broken code mein bug dhundho
• 🧩 **Memory Match** — Code terms aur definitions match karo
• ⚔️ **Code Battle** — PvP coding challenges
• 🔮 **Code Prediction** — Code ka output predict karo
• 📝 **Fill in the Blank** — Missing code complete karo

**Beginners ke liye:** Code Quiz + Memory Match
**Practice ke liye:** Bug Hunt + Fill in the Blank
**Zyada XP:** Code Battle + Code Quiz`
  },

  leaderboard: {
    keys: ['leaderboard','rank','ranking','top player','diamond league','league','position','#1','number 1'],
    en: `**Diamond League Leaderboard** 🏆

The leaderboard shows all Bitzy players ranked by XP!

**How ranking works:**
1. Primary sort: **Total XP** (highest first)
2. Tie-breaker: **Streak** (longer streak wins)

**Top 3 get a special podium!** 👑🥈🥉

**How to climb ranks:**
• Do Arena challenges (most XP per activity)
• Complete quizzes daily
• Maintain your streak
• Play Code Quiz game repeatedly

**Pro strategy:** 1 Arena challenge > 3 lessons in terms of XP. Focus on Arena!`,
    hi: `**Diamond League Leaderboard** 🏆

Sab Bitzy players yahan XP ke hisaab se rank hote hain!

**Ranking kaise hoti hai:**
1. Pehle: **Total XP** (jitna zyada, utna upar)
2. Agar tie ho: **Streak** (jiska zyada, woh aage)

**Top 3 ko special podium milta hai!** 👑🥈🥉

**Rank kaise chadho:**
• Arena challenges karo (sabse zyada XP)
• Roz quizzes complete karo
• Streak maintain raho
• Code Quiz game repeatedly khelo

**Pro tip bhai:** 1 Arena challenge = 3 lessons ka XP. Arena focus karo!`
  },

  // ── PROGRAMMING TOPICS ─────────────────────────────────────

  variables: {
    keys: ['variable','variables','var','let','const','declare','declaration','assignment','var vs let','let vs const'],
    en: `**Variables in JavaScript** 📦

Think of variables like labeled boxes — you store data in them!

**3 ways to declare:**
\`\`\`javascript
var name = "Bitzy";    // Old way — avoid this
let age = 16;          // Can change later ✅
const PI = 3.14;       // Never changes ✅
\`\`\`

**Key differences:**
| | var | let | const |
|--|--|--|--|
| Can reassign | ✅ | ✅ | ❌ |
| Block scoped | ❌ | ✅ | ✅ |
| Hoisted | ✅ | ❌ | ❌ |

**Rule of thumb:**
• Use \`const\` by default
• Use \`let\` if you need to reassign
• Never use \`var\` in modern code

**Try karo:** Create a variable for your name and age using const and let!`,
    hi: `**Variables in JavaScript** 📦

Variables ko aise socho — labeled boxes jisme data rakhte hain!

**3 tarike:**
\`\`\`javascript
var name = "Bitzy";    // Purana tarika — mat use karo
let age = 16;          // Baad mein badal sakte ho ✅
const PI = 3.14;       // Kabhi nahi badlega ✅
\`\`\`

**Farak kya hai:**
• \`const\` — value kabhi nahi badlegi
• \`let\` — value baad mein badal sakte ho
• \`var\` — purana hai, avoid karo

**Simple rule yaar:**
• Default pe \`const\` use karo
• Agar value change karni ho toh \`let\`
• \`var\` kabhi mat use karo modern code mein

**Try karo:** Apna naam aur age \`const\` aur \`let\` se banao!`
  },

  functions: {
    keys: ['function','functions','arrow function','callback','return','def','method','func','parameter','argument'],
    en: `**Functions in JavaScript** ⚙️

Functions are reusable blocks of code — like recipes!

**3 ways to write functions:**
\`\`\`javascript
// 1. Function declaration
function greet(name) {
  return "Hello, " + name + "!";
}

// 2. Function expression
const greet = function(name) {
  return "Hello, " + name + "!";
};

// 3. Arrow function (modern, preferred)
const greet = (name) => {
  return "Hello, " + name + "!";
};

// Short arrow (single return)
const greet = name => "Hello, " + name + "!";
\`\`\`

**Calling a function:**
\`\`\`javascript
console.log(greet("Aaryan")); // Hello, Aaryan!
\`\`\`

**Key concepts:**
• **Parameters** = inputs (name)
• **Return** = output
• **Calling** = using the function

**Try karo:** Write a function that takes 2 numbers and returns their sum!`,
    hi: `**Functions in JavaScript** ⚙️

Functions = reusable code blocks — jaise recipes hoti hain!

**3 tarike:**
\`\`\`javascript
// 1. Normal function
function greet(naam) {
  return "Hello, " + naam + "!";
}

// 2. Arrow function (modern way)
const greet = (naam) => {
  return "Hello, " + naam + "!";
};

// Short form
const greet = naam => "Hello, " + naam + "!";
\`\`\`

**Use kaise karein:**
\`\`\`javascript
console.log(greet("Aaryan")); // Hello, Aaryan!
\`\`\`

**Yaad rakho:**
• **Parameters** = inputs jo andar jaate hain
• **Return** = output jo bahar aata hai
• **Calling** = function ko use karna

**Try karo bhai:** Ek function banao jo 2 numbers leke unka sum return kare!`
  },

  closures: {
    keys: ['closure','closures','scope','lexical','inner function','outer function','closure kya','closure explain'],
    en: `**Closures in JavaScript** 🔐

A closure = a function that remembers variables from its outer scope, even after the outer function finishes!

**Simple example:**
\`\`\`javascript
function counter() {
  let count = 0;           // outer variable

  return function() {      // inner function (closure)
    count++;
    return count;
  };
}

const myCounter = counter();
console.log(myCounter()); // 1
console.log(myCounter()); // 2
console.log(myCounter()); // 3
\`\`\`

**What happened?**
• \`counter()\` ran and finished
• But \`count\` is still alive! 👻
• The inner function "closed over" the \`count\` variable

**Real world use:**
\`\`\`javascript
function makeMultiplier(x) {
  return (num) => num * x;  // remembers x!
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
\`\`\`

**Try karo:** Make a function that remembers how many times it's been called!`,
    hi: `**Closures in JavaScript** 🔐

Closure = ek function jo apne bahar ke variables yaad rakhta hai, chahe outer function khatam ho jaye!

**Simple example:**
\`\`\`javascript
function counter() {
  let count = 0;        // bahar ka variable

  return function() {   // andar ka function (closure)
    count++;
    return count;
  };
}

const myCounter = counter();
console.log(myCounter()); // 1
console.log(myCounter()); // 2
console.log(myCounter()); // 3
\`\`\`

**Kya hua yahan:**
• \`counter()\` khatam ho gaya
• Lekin \`count\` abhi bhi zinda hai! 👻
• Inner function ne \`count\` ko "yaad" rakh liya

**Analogy:** Socho jaise ek dukaan band ho gayi, lekin dukandaar ne apni chabhi rakhi hui hai — andar ghus sakta hai!

**Real use:**
\`\`\`javascript
function multiplier(x) {
  return (num) => num * x; // x yaad hai!
}

const double = multiplier(2);
console.log(double(5)); // 10
\`\`\`

**Try karo bhai:** Ek function banao jo count kare kitni baar call hua!`
  },

  arrays: {
    keys: ['array','arrays','list','push','pop','map','filter','reduce','foreach','slice','splice','index','length'],
    en: `**Arrays in JavaScript** 📋

Arrays = ordered lists of items!

**Create an array:**
\`\`\`javascript
const fruits = ["apple", "banana", "mango"];
const nums = [1, 2, 3, 4, 5];
\`\`\`

**Access items (0-indexed!):**
\`\`\`javascript
console.log(fruits[0]); // "apple"
console.log(fruits[2]); // "mango"
\`\`\`

**Most useful methods:**
\`\`\`javascript
// Add/Remove
fruits.push("grape");     // add at end
fruits.pop();             // remove from end
fruits.unshift("kiwi");   // add at start

// Transform (return new array)
const upper = fruits.map(f => f.toUpperCase());
const long = fruits.filter(f => f.length > 5);
const total = nums.reduce((sum, n) => sum + n, 0);

// Find
const found = fruits.find(f => f === "mango");
const idx = fruits.indexOf("banana"); // 1
\`\`\`

**Try karo:** Create an array of 5 numbers, then use filter to keep only even numbers!`,
    hi: `**Arrays in JavaScript** 📋

Array = items ki ordered list — jaise ek numbered list!

**Array banao:**
\`\`\`javascript
const fruits = ["apple", "banana", "mango"];
const nums = [1, 2, 3, 4, 5];
\`\`\`

**Items access karo (0 se shuru hoti hai):**
\`\`\`javascript
console.log(fruits[0]); // "apple"
console.log(fruits[2]); // "mango"
\`\`\`

**Sabse kaam ke methods:**
\`\`\`javascript
fruits.push("grape");  // end mein add
fruits.pop();          // end se remove

// New array banate hain
const bade = fruits.map(f => f.toUpperCase());
const chote = fruits.filter(f => f.length <= 5);
const sum = nums.reduce((total, n) => total + n, 0);
\`\`\`

**Try karo bhai:** 5 numbers ki array banao, phir sirf even numbers filter karo!`
  },

  objects: {
    keys: ['object','objects','key value','property','method','json','dot notation','bracket notation','this'],
    en: `**Objects in JavaScript** 🎁

Objects store related data together — like a real-world thing with properties!

**Create an object:**
\`\`\`javascript
const person = {
  name: "Aaryan",
  age: 16,
  city: "Mumbai",
  isStudent: true
};
\`\`\`

**Access properties:**
\`\`\`javascript
console.log(person.name);      // "Aaryan" (dot notation)
console.log(person["age"]);    // 16 (bracket notation)
\`\`\`

**Add/Update/Delete:**
\`\`\`javascript
person.email = "a@b.com";     // add
person.age = 17;               // update
delete person.city;            // delete
\`\`\`

**Methods (functions inside objects):**
\`\`\`javascript
const dog = {
  name: "Buddy",
  bark: function() {
    return this.name + " says: Woof!";
  }
};

console.log(dog.bark()); // "Buddy says: Woof!"
\`\`\`

**Try karo:** Create an object for yourself with name, age, hobby, and a method to introduce yourself!`,
    hi: `**Objects in JavaScript** 🎁

Object = ek real-world cheez ka digital representation — properties aur values ke saath!

**Object banao:**
\`\`\`javascript
const person = {
  name: "Aaryan",
  age: 16,
  city: "Mumbai",
  student: true
};
\`\`\`

**Properties access karo:**
\`\`\`javascript
console.log(person.name);    // "Aaryan"
console.log(person["age"]);  // 16
\`\`\`

**Add/Update/Delete:**
\`\`\`javascript
person.email = "a@b.com";  // naya property
person.age = 17;            // update
delete person.city;         // delete
\`\`\`

**Methods — functions inside object:**
\`\`\`javascript
const dog = {
  name: "Buddy",
  bark() {
    return this.name + " bol raha hai: Woof!";
  }
};
console.log(dog.bark()); // "Buddy bol raha hai: Woof!"
\`\`\`

**Try karo:** Apna ek object banao — naam, age, hobby, aur ek method jo tumhara introduction de!`
  },

  promises: {
    keys: ['promise','promises','async','await','async await','then','catch','asynchronous','fetch','api call','setTimeout'],
    en: `**Promises & Async/Await** ⏳

Promises handle things that take time — like API calls!

**The problem:**
\`\`\`javascript
// This doesn't work — data isn't ready yet!
const data = fetchFromServer(); // takes 2 seconds
console.log(data); // undefined! 😱
\`\`\`

**Solution 1 — Promises:**
\`\`\`javascript
fetchFromServer()
  .then(data => {
    console.log(data); // works! ✅
  })
  .catch(error => {
    console.log("Error:", error);
  });
\`\`\`

**Solution 2 — Async/Await (cleaner):**
\`\`\`javascript
async function loadData() {
  try {
    const data = await fetchFromServer();
    console.log(data); // works! ✅
  } catch (error) {
    console.log("Error:", error);
  }
}

loadData();
\`\`\`

**Real example — fetch API:**
\`\`\`javascript
async function getUsers() {
  const res = await fetch("https://api.example.com/users");
  const users = await res.json();
  return users;
}
\`\`\`

**Try karo:** Wrap a setTimeout in a Promise and resolve it after 2 seconds!`,
    hi: `**Promises & Async/Await** ⏳

Promise = ek guarantee ki "yeh kaam ho jayega, thoda wait karo!"

**Problem:**
\`\`\`javascript
// Yeh kaam nahi karta — data abhi ready nahi!
const data = serverSeData(); // 2 second lagenge
console.log(data); // undefined! 😱
\`\`\`

**Solution 1 — Promise:**
\`\`\`javascript
serverSeData()
  .then(data => {
    console.log(data); // ho gaya! ✅
  })
  .catch(error => {
    console.log("Error:", error);
  });
\`\`\`

**Solution 2 — Async/Await (better aur clean):**
\`\`\`javascript
async function dataLao() {
  try {
    const data = await serverSeData();
    console.log(data); // ✅
  } catch (error) {
    console.log("Error:", error);
  }
}
\`\`\`

**Analogy bhai:** Socho tumne pizza order kiya — promise hai ki milega. await matlab "jab tak nahi aaya, ruk jao". .then() matlab "aane ke baad yeh karo"!

**Try karo:** setTimeout ko Promise mein wrap karo aur 2 second baad resolve karo!`
  },

  reactHooks: {
    keys: ['hook','hooks','usestate','useeffect','useref','usecallback','usememo','usecontext','react hook','state management'],
    en: `**React Hooks** ⚛️

Hooks let you use state and other React features in functional components!

**useState — store data:**
\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // initial value = 0

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
\`\`\`

**useEffect — run code on events:**
\`\`\`jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // runs when component mounts
    console.log("Component loaded!");
    
    // cleanup function
    return () => console.log("Component removed!");
  }, []); // [] = run only once
\`\`\`

**useRef — access DOM elements:**
\`\`\`jsx
const inputRef = useRef(null);

<input ref={inputRef} />
<button onClick={() => inputRef.current.focus()}>
  Focus Input
</button>
\`\`\`

**Golden rules:**
1. Only call hooks at the top level (not inside if/loops)
2. Only call hooks in React functions
3. Always include dependencies in useEffect array

**Try karo:** Build a counter with useState that also logs every count change using useEffect!`,
    hi: `**React Hooks** ⚛️

Hooks = functional components mein state aur features use karne ka tarika!

**useState — data store karo:**
\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // 0 se shuru

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
\`\`\`

**useEffect — side effects handle karo:**
\`\`\`jsx
useEffect(() => {
  console.log("Component load hua!");
  
  return () => console.log("Component hata!");
}, []); // [] = sirf ek baar chale
\`\`\`

**Analogy bhai:**
• \`useState\` = ek diary jisme value likho
• \`useEffect\` = ek watcher jo changes dekhe
• \`useRef\` = ek sticky note jo render pe reset nahi hoti

**Golden rules:**
1. Hooks sirf top level pe call karo (if/loop mein nahi)
2. Sirf React functions mein use karo

**Try karo:** Counter banao jisme useState se count track ho aur useEffect se har change log ho!`
  },

  css: {
    keys: ['css','flexbox','grid','styling','style','layout','flex','display','position','margin','padding','responsive','media query','tailwind','bootstrap'],
    en: `**CSS — Styling Made Simple** 🎨

CSS makes your HTML look beautiful!

**Flexbox (most useful layout):**
\`\`\`css
.container {
  display: flex;
  justify-content: center;   /* horizontal alignment */
  align-items: center;       /* vertical alignment */
  gap: 16px;                 /* space between items */
  flex-wrap: wrap;           /* wrap to next line */
}
\`\`\`

**CSS Grid (for complex layouts):**
\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  gap: 20px;
}
\`\`\`

**The Box Model:**
\`\`\`
┌─────────────────────────┐
│         MARGIN          │
│  ┌───────────────────┐  │
│  │      BORDER       │  │
│  │  ┌─────────────┐  │  │
│  │  │   PADDING   │  │  │
│  │  │  ┌───────┐  │  │  │
│  │  │  │ CONTENT│  │  │  │
│  │  │  └───────┘  │  │  │
\`\`\`

**Responsive design:**
\`\`\`css
/* Mobile first */
.box { width: 100%; }

/* Tablet and up */
@media (min-width: 768px) {
  .box { width: 50%; }
}

/* Desktop */
@media (min-width: 1024px) {
  .box { width: 33%; }
}
\`\`\`

**Try karo:** Center a div both horizontally and vertically using flexbox!`,
    hi: `**CSS — Styling ka Magic** 🎨

CSS se HTML ko sundar banate hain!

**Flexbox (sabse useful):**
\`\`\`css
.container {
  display: flex;
  justify-content: center; /* horizontal center */
  align-items: center;     /* vertical center */
  gap: 16px;               /* items ke beech space */
}
\`\`\`

**Grid (complex layouts ke liye):**
\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns */
  gap: 20px;
}
\`\`\`

**Box Model yaad rakho:**
• **Content** = actual cheez
• **Padding** = content ke around inner space
• **Border** = line/outline
• **Margin** = bahar ka space

**Responsive design:**
\`\`\`css
/* Mobile */
.box { width: 100%; }

/* Tablet se upar */
@media (min-width: 768px) {
  .box { width: 50%; }
}
\`\`\`

**Analogy:** Padding = kapde ke andar ka space, Margin = logon ke beech ka space 😄

**Try karo bhai:** Flexbox use karke ek div ko screen ke bilkul center mein rakho!`
  },

  python: {
    keys: ['python','py','python basics','print','def python','list python','dict','dictionary','pip','indentation'],
    en: `**Python — Beginner's Best Friend** 🐍

Python is clean, readable, and powerful!

**Basics:**
\`\`\`python
# Variables (no need to declare type!)
name = "Aaryan"
age = 16
is_student = True

# Print
print(f"Hello {name}, you are {age}!")

# Input from user
user_input = input("Enter your name: ")
\`\`\`

**Lists (like JS arrays):**
\`\`\`python
fruits = ["apple", "banana", "mango"]
fruits.append("grape")      # add
fruits.remove("banana")     # remove
print(fruits[0])            # "apple"

# List comprehension (powerful!)
squares = [x**2 for x in range(1, 6)]
# [1, 4, 9, 16, 25]
\`\`\`

**Functions:**
\`\`\`python
def greet(name, age=0):    # default parameter
    return f"Hi {name}, you are {age} years old!"

print(greet("Aaryan", 16))
\`\`\`

**Dictionaries (like JS objects):**
\`\`\`python
person = {
    "name": "Aaryan",
    "age": 16,
    "city": "Mumbai"
}

print(person["name"])      # "Aaryan"
person["email"] = "a@b.com"  # add key
\`\`\`

**Try karo:** Write a Python function that takes a list of numbers and returns only the even ones!`,
    hi: `**Python — Sabse Aasan Language** 🐍

Python simple, clean, aur powerful hai — beginners ki best friend!

**Basics:**
\`\`\`python
# Variables — type batana zaruri nahi!
naam = "Aaryan"
age = 16
student = True

# Print
print(f"Hello {naam}, age hai {age}!")

# User se input
user = input("Apna naam likho: ")
\`\`\`

**Lists (JS arrays jaisi):**
\`\`\`python
fruits = ["apple", "banana", "mango"]
fruits.append("grape")   # add
fruits.remove("banana")  # remove

# Short trick
squares = [x**2 for x in range(1, 6)]
# [1, 4, 9, 16, 25]
\`\`\`

**Functions:**
\`\`\`python
def greet(naam, age=0):
    return f"Hi {naam}, tumhari age {age} hai!"

print(greet("Aaryan", 16))
\`\`\`

**Dictionary (JS object jaisa):**
\`\`\`python
person = {
    "naam": "Aaryan",
    "age": 16,
    "city": "Mumbai"
}
print(person["naam"])
\`\`\`

**Python ka superpower:** Code padha seedha samajh aata hai, English jaisa lagta hai!

**Try karo bhai:** Ek function banao jo numbers ki list le aur sirf even numbers return kare!`
  },

  git: {
    keys: ['git','github','version control','commit','push','pull','branch','merge','clone','repository','repo','init'],
    en: `**Git — Version Control** 🔧

Git saves your code history — like Ctrl+Z on steroids!

**Essential commands:**
\`\`\`bash
# Setup (one time)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Start a project
git init                    # new repo
git clone <url>             # clone existing repo

# Daily workflow
git status                  # see what changed
git add .                   # stage all changes
git add filename.js         # stage one file
git commit -m "your message" # save snapshot

# Sync with GitHub
git push origin main        # upload
git pull origin main        # download
\`\`\`

**Branching:**
\`\`\`bash
git branch feature-login    # create branch
git checkout feature-login  # switch to it
git checkout -b new-feature # create + switch in one go

git merge feature-login     # merge into current branch
\`\`\`

**The Golden Rule:**
Commit early, commit often. Each commit = one logical change!

**Try karo:** Init a git repo, make a file, add and commit it!`,
    hi: `**Git — Version Control** 🔧

Git = tumhare code ka time machine — koi bhi purana version wapas la sakte ho!

**Zaruri commands:**
\`\`\`bash
# Pehli baar setup
git config --global user.name "Tumhara Naam"
git config --global user.email "email@example.com"

# Project shuru karo
git init                      # naya repo
git clone <url>               # existing copy karo

# Roz ka kaam
git status                    # kya badla dekho
git add .                     # sab changes stage karo
git commit -m "message"       # snapshot save karo

# GitHub pe bhejo
git push origin main          # upload
git pull origin main          # download
\`\`\`

**Branching (alag feature pe kaam karo):**
\`\`\`bash
git checkout -b new-feature  # naya branch banao + switch karo
git merge new-feature         # wapas merge karo
\`\`\`

**Analogy bhai:**
• **Commit** = game ka checkpoint save karna
• **Branch** = game ka naya playthrough
• **Merge** = dono playthroughs combine karna

**Try karo:** Apne computer pe git init karo, ek file banao, aur pehla commit karo!`
  },

  sql: {
    keys: ['sql','database','query','select','table','insert','update','delete','join','where','mysql','postgres','supabase','db'],
    en: `**SQL — Database Language** 🗄️

SQL lets you store, retrieve, and manipulate data in databases!

**Basic CRUD operations:**
\`\`\`sql
-- CREATE (Insert data)
INSERT INTO users (name, age, email)
VALUES ('Aaryan', 16, 'a@b.com');

-- READ (Get data)
SELECT * FROM users;
SELECT name, age FROM users WHERE age > 15;
SELECT * FROM users ORDER BY age DESC LIMIT 10;

-- UPDATE (Modify data)
UPDATE users SET age = 17 WHERE name = 'Aaryan';

-- DELETE (Remove data)
DELETE FROM users WHERE age < 13;
\`\`\`

**JOINs (connect tables):**
\`\`\`sql
-- Get users with their orders
SELECT users.name, orders.product
FROM users
INNER JOIN orders ON users.id = orders.user_id;
\`\`\`

**Useful functions:**
\`\`\`sql
SELECT COUNT(*) FROM users;          -- count rows
SELECT AVG(age) FROM users;          -- average
SELECT MAX(age), MIN(age) FROM users; -- max/min
SELECT * FROM users WHERE name LIKE '%ary%'; -- search
\`\`\`

**Try karo:** Write a query to find all users above age 18, ordered by name!`,
    hi: `**SQL — Database ki Language** 🗄️

SQL se database mein data store, fetch aur manage karte hain!

**Basic operations:**
\`\`\`sql
-- Data daalo (CREATE)
INSERT INTO users (naam, age, email)
VALUES ('Aaryan', 16, 'a@b.com');

-- Data nikalo (READ)
SELECT * FROM users;
SELECT naam, age FROM users WHERE age > 15;

-- Data badlo (UPDATE)
UPDATE users SET age = 17 WHERE naam = 'Aaryan';

-- Data hatao (DELETE)
DELETE FROM users WHERE age < 13;
\`\`\`

**JOIN — do tables connect karo:**
\`\`\`sql
SELECT users.naam, orders.product
FROM users
INNER JOIN orders ON users.id = orders.user_id;
\`\`\`

**Analogy bhai:**
• **Table** = Excel sheet
• **Row** = ek entry
• **Column** = ek field (naam, age, etc.)
• **SELECT** = filter lagao aur data nikalo

**Try karo:** Ek query likho jo 18 se upar ke sab users ko naam ke order mein dikhaye!`
  },

  typescript: {
    keys: ['typescript','ts','type','interface','enum','generic','type annotation','typed','tsc'],
    en: `**TypeScript — JavaScript with Superpowers** 📘

TypeScript adds types to JavaScript — catches errors before runtime!

**Basic types:**
\`\`\`typescript
// Primitives
let name: string = "Aaryan";
let age: number = 16;
let isStudent: boolean = true;

// Arrays
let scores: number[] = [95, 87, 92];
let tags: string[] = ["html", "css", "js"];

// Function with types
function greet(name: string, age: number): string {
  return \`Hi \${name}, you are \${age}!\`;
}
\`\`\`

**Interfaces (define object shapes):**
\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // optional with ?
}

const user: User = {
  id: 1,
  name: "Aaryan",
  email: "a@b.com"
};
\`\`\`

**Union types:**
\`\`\`typescript
let id: string | number = "abc123"; // string OR number
id = 42; // also valid!
\`\`\`

**Why use TypeScript?**
• Catches bugs before you run the code
• Amazing autocomplete in VS Code
• Makes big projects manageable

**Try karo:** Convert a simple JS function to TypeScript with proper type annotations!`,
    hi: `**TypeScript — JavaScript ka Bada Bhai** 📘

TypeScript = JavaScript + types. Errors run time se pehle pakad leta hai!

**Basic types:**
\`\`\`typescript
let naam: string = "Aaryan";
let age: number = 16;
let student: boolean = true;

// Array
let scores: number[] = [95, 87, 92];

// Function
function greet(naam: string, age: number): string {
  return \`Hi \${naam}!\`;
}
\`\`\`

**Interface — object ka blueprint:**
\`\`\`typescript
interface User {
  id: number;
  naam: string;
  email: string;
  age?: number; // optional
}

const user: User = {
  id: 1,
  naam: "Aaryan",
  email: "a@b.com"
};
\`\`\`

**TypeScript kyun use karein:**
• Code likhte waqt hi error bata deta hai
• VS Code mein autocomplete bahut acha milta hai
• Bade projects mein sanity banaye rakhta hai

**Analogy bhai:** TypeScript = driving license wala system. Bina license (type) ke gadi (value) chalane nahi deta!

**Try karo:** Ek simple JS function ko TypeScript mein convert karo types ke saath!`
  },

  dataStructures: {
    keys: ['data structure','algorithm','linked list','stack','queue','tree','binary tree','hash','big o','complexity','sorting','recursion','dsa'],
    en: `**Data Structures & Algorithms** 🔣

DSA = how to organize data + how to solve problems efficiently!

**Stack (LIFO — Last In, First Out):**
\`\`\`javascript
const stack = [];
stack.push(1);    // [1]
stack.push(2);    // [1, 2]
stack.push(3);    // [1, 2, 3]
stack.pop();      // returns 3, stack = [1, 2]
\`\`\`

**Queue (FIFO — First In, First Out):**
\`\`\`javascript
const queue = [];
queue.push("A");  // ["A"]
queue.push("B");  // ["A", "B"]
queue.shift();    // returns "A", queue = ["B"]
\`\`\`

**Big O Notation (efficiency):**
| Notation | Name | Example |
|--|--|--|
| O(1) | Constant | Array access |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Loop through array |
| O(n²) | Quadratic | Nested loops |

**Recursion:**
\`\`\`javascript
function factorial(n) {
  if (n <= 1) return 1;    // base case
  return n * factorial(n - 1); // recursive call
}
console.log(factorial(5)); // 120
\`\`\`

**Try karo:** Implement a stack that also tracks the minimum element in O(1) time!`,
    hi: `**Data Structures & Algorithms** 🔣

DSA = data organize karna + problems efficiently solve karna!

**Stack (LIFO — jo last aaya wo pehle jaayega):**
\`\`\`javascript
const stack = [];
stack.push(1);  // [1]
stack.push(2);  // [1, 2]
stack.pop();    // 2 nikla, [1]
\`\`\`

**Queue (FIFO — jo pehle aaya wo pehle jaayega):**
\`\`\`javascript
const queue = [];
queue.push("A"); // ["A"]
queue.push("B"); // ["A", "B"]
queue.shift();   // "A" nikla
\`\`\`

**Big O — code ki efficiency:**
• O(1) = constant — har baar same time
• O(n) = linear — data double = time double
• O(n²) = quadratic — nested loops, slow!

**Recursion:**
\`\`\`javascript
function factorial(n) {
  if (n <= 1) return 1;          // base case
  return n * factorial(n - 1);   // apne aap ko call karo
}
console.log(factorial(5)); // 120
\`\`\`

**Analogy:**
• Stack = plate stack — upar wali pehle utho
• Queue = line mein khade hona — pehle aao, pehle jao

**Try karo bhai:** Stack implement karo jo minimum element bhi O(1) mein de!`
  },

  html: {
    keys: ['html','tag','element','semantic','div','span','head','body','form','input','button','link','href','src'],
    en: `**HTML — Structure of the Web** 🌐

HTML is the skeleton of every webpage!

**Basic structure:**
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
</head>
<body>
  <h1>Hello World!</h1>
  <p>This is a paragraph.</p>
</body>
</html>
\`\`\`

**Common tags:**
\`\`\`html
<!-- Headings -->
<h1>Biggest</h1>  <h6>Smallest</h6>

<!-- Text -->
<p>Paragraph</p>
<strong>Bold</strong>  <em>Italic</em>

<!-- Links & Images -->
<a href="https://bitzy.app">Visit Bitzy</a>
<img src="logo.png" alt="Logo">

<!-- Lists -->
<ul><li>Unordered item</li></ul>
<ol><li>Ordered item</li></ol>

<!-- Forms -->
<input type="text" placeholder="Enter name">
<button type="submit">Submit</button>
\`\`\`

**Semantic HTML (use these!):**
\`\`\`html
<header>, <nav>, <main>, <section>, 
<article>, <aside>, <footer>
\`\`\`

**Try karo:** Build a basic profile card with your name, photo, and 3 hobbies using proper HTML!`,
    hi: `**HTML — Web ka Skeleton** 🌐

HTML = har webpage ki body. Iske bina kuch nahi!

**Basic structure:**
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Mera Page</title>
</head>
<body>
  <h1>Hello Duniya!</h1>
  <p>Yeh ek paragraph hai.</p>
</body>
</html>
\`\`\`

**Kaam ke tags:**
\`\`\`html
<!-- Headings -->
<h1>Sabse bada</h1>

<!-- Text -->
<p>Paragraph</p>
<strong>Bold</strong>

<!-- Links aur Images -->
<a href="https://bitzy.app">Bitzy kholo</a>
<img src="photo.png" alt="Photo">

<!-- Lists -->
<ul><li>Unordered</li></ul>
<ol><li>Ordered</li></ol>

<!-- Forms -->
<input type="text" placeholder="Naam likho">
<button>Submit</button>
\`\`\`

**Analogy bhai:** HTML = ghar ka dhanccha. CSS = painting aur decoration. JS = bijli aur AC!

**Try karo:** Ek profile card banao — apna naam, photo, aur 3 hobbies HTML mein!`
  },

  react: {
    keys: ['react','component','jsx','props','state','reactjs','vite','create react app','react router','next.js','nextjs'],
    en: `**React — Modern Web Apps** ⚛️

React lets you build UIs from reusable components!

**Your first component:**
\`\`\`jsx
// Simple component
function Greeting({ name, age }) {
  return (
    <div className="card">
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// Use it
<Greeting name="Aaryan" age={16} />
\`\`\`

**useState for interactivity:**
\`\`\`jsx
import { useState } from 'react';

function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => setIsOn(!isOn)}>
      {isOn ? "ON 🟢" : "OFF 🔴"}
    </button>
  );
}
\`\`\`

**Props = read-only inputs to a component**
**State = internal data that can change**

**Conditional rendering:**
\`\`\`jsx
{isLoggedIn ? <Dashboard /> : <Login />}
{items.length > 0 && <ItemList items={items} />}
\`\`\`

**List rendering:**
\`\`\`jsx
const names = ["Alice", "Bob", "Charlie"];

{names.map((name, index) => (
  <p key={index}>{name}</p>
))}
\`\`\`

**Try karo:** Build a counter component with +/- buttons and a reset button!`,
    hi: `**React — Modern Web Apps** ⚛️

React = reusable components se UI banana!

**Pehla component:**
\`\`\`jsx
function Greeting({ naam, age }) {
  return (
    <div>
      <h1>Hello, {naam}!</h1>
      <p>Tumhari age {age} hai.</p>
    </div>
  );
}

// Use karo
<Greeting naam="Aaryan" age={16} />
\`\`\`

**useState — interactive banao:**
\`\`\`jsx
import { useState } from 'react';

function Toggle() {
  const [on, setOn] = useState(false);

  return (
    <button onClick={() => setOn(!on)}>
      {on ? "ON 🟢" : "OFF 🔴"}
    </button>
  );
}
\`\`\`

**Key concepts:**
• **Props** = component ko bahar se data dena (read-only)
• **State** = component ka apna data (change ho sakta hai)
• **JSX** = HTML-jaisa syntax JavaScript mein

**Analogy bhai:**
• Component = Lego brick
• Props = brick ka color/size
• State = brick ka glow (change ho sakta hai)

**Try karo:** +/- aur reset buttons wala counter component banao!`
  },

  debugging: {
    keys: ['debug','debugging','error','bug','fix','console.log','console','breakpoint','typeof','undefined','null','nan','syntax error','type error'],
    en: `**Debugging — Find & Fix Bugs** 🐛

Debugging is a superpower — every great developer debugs well!

**Step 1 — Read the error:**
\`\`\`
TypeError: Cannot read property 'name' of undefined
          ↑ Error type    ↑ What went wrong
\`\`\`

**Common errors:**
| Error | Cause |
|--|--|
| TypeError | Wrong type used |
| ReferenceError | Variable not defined |
| SyntaxError | Wrong syntax (typo) |
| undefined | Variable exists but no value |
| null | Intentionally empty |

**Debugging tools:**
\`\`\`javascript
// 1. console.log (most used!)
console.log("value:", myVariable);

// 2. Check type
console.log(typeof myVariable); // "string", "number", etc.

// 3. Conditional check
if (!myVariable) {
  console.log("Variable is empty!");
}

// 4. Try-catch for async errors
try {
  const data = await fetchData();
} catch (error) {
  console.error("Error:", error.message);
}
\`\`\`

**Debugging mindset:**
1. Don't panic — bugs are normal!
2. Read the error message carefully
3. Check line number mentioned in error
4. Add console.logs to trace the issue
5. Google the exact error message

**Try karo:** Intentionally break your code and practice reading error messages!`,
    hi: `**Debugging — Bug Dhundho aur Thao!** 🐛

Debugging = code doctor banna. Har developer yeh karta hai!

**Step 1 — Error padho:**
\`\`\`
TypeError: Cannot read property 'name' of undefined
↑ Kya galat hua           ↑ Kyun galat hua
\`\`\`

**Common errors:**
• **TypeError** — galat type use ki
• **ReferenceError** — variable define nahi hai
• **SyntaxError** — typo ya galat syntax
• **undefined** — variable hai par value nahi

**Debugging tools:**
\`\`\`javascript
// 1. console.log (sabse zyada use hota hai!)
console.log("yahan hun:", myVariable);

// 2. Type check karo
console.log(typeof myVariable);

// 3. Conditional check
if (!myVariable) {
  console.log("Variable empty hai!");
}

// 4. Try-catch
try {
  const data = await fetchData();
} catch (error) {
  console.error("Error:", error.message);
}
\`\`\`

**Debugging mindset bhai:**
1. Ghabrao mat — bugs normal hain!
2. Error message dhyan se padho
3. Line number dekho
4. Console.log lagao trace karne ke liye
5. Exact error Google karo — Stack Overflow mein answer milega!

**Try karo:** Apna code tod ke practice karo error messages padhne ki!`
  },
  greeting: {
    keys: ['hi','hello','hey','namaste','yo','sup','good morning','good evening','kaise ho','whats up'],
    en: `Hey there! 👋 I'm **Sub AI**, your Bitzy coding mentor!\n\nAsk me about:\n• 💻 **Coding** — JavaScript, Python, React, CSS, SQL, Git, TypeScript, DSA\n• 🎮 **Bitzy** — XP, streaks, energy, badges, arena, games, leaderboard\n\nWhat do you want to learn today? 🚀`,
    hi: `Hey bhai! 👋 Main **Sub AI** hun, tumhara Bitzy coding mentor!\n\nKya puch sakte ho:\n• 💻 **Coding** — JavaScript, Python, React, CSS, SQL, Git, TypeScript, DSA\n• 🎮 **Bitzy** — XP, streaks, energy, badges, arena, games, leaderboard\n\nAaj kya seekhna hai? 🚀`
  },

  thanks: {
    keys: ['thanks','thank you','thanx','shukriya','dhanyavad','ty','thx'],
    en: `You're welcome! 😊 Keep coding, keep grinding — every line of code makes you better! 🚀\n\nAnything else I can help with?`,
    hi: `Koi baat nahi bhai! 😊 Coding karte raho, har line tumhe better banati hai! 🚀\n\nKuch aur puchna hai?`
  },

  about: {
    keys: ['what is bitzy','bitzy kya hai','about bitzy','who are you','sub ai','what can you do','help','madad'],
    en: `**About Bitzy** 🎮\n\nBitzy is a gamified platform to learn coding through:\n• 📚 Interactive courses (HTML to React)\n• ⚔️ Arena coding challenges\n• 🎲 Fun mini-games\n• 🏆 XP, streaks, badges & leaderboard\n\n**I'm Sub AI** — your built-in coding mentor. I can:\n• Explain any programming concept\n• Debug your code\n• Run mock interviews\n• Help plan projects\n\nTry asking: "explain closures" or "how does XP work"!`,
    hi: `**Bitzy ke baare mein** 🎮\n\nBitzy ek gamified coding platform hai:\n• 📚 Interactive courses (HTML se React tak)\n• ⚔️ Arena coding challenges\n• 🎲 Fun mini-games\n• 🏆 XP, streaks, badges aur leaderboard\n\n**Main Sub AI hun** — tumhara built-in coding mentor. Main:\n• Koi bhi programming concept samjha sakta hun\n• Code debug kar sakta hun\n• Mock interview le sakta hun\n• Project planning mein help karta hun\n\nTry karo: "closures explain karo" ya "XP kaise milta hai"!`
  },

  support: {
    keys: ['contact','support','help me','issue','problem with app','report bug','feedback','customer care','complaint'],
    en: `**Need help?** 🛟\n\nFor app issues, bugs, or feedback, check our **Privacy & Support** page (linked in the footer of the home page) — it has our contact email and support form.\n\nFor coding doubts, ask me directly — I'm available 24/7! 😄`,
    hi: `**Help chahiye?** 🛟\n\nApp issues, bugs ya feedback ke liye home page ke footer mein **Privacy & Support** page check karo — wahan contact email aur support form hai.\n\nCoding doubts ke liye mujhse seedha puch — main 24/7 available hun! 😄`
  },

  loops: {
    keys: ['loop','loops','for loop','while loop','do while','iterate','iteration','for...of','for...in'],
    en: "**Loops in JavaScript** \ud83d\udd01\n\nLoops repeat code multiple times!\n\n**for loop:**\n```javascript\nfor (let i = 0; i < 5; i++) {\n  console.log(i); // 0,1,2,3,4\n}\n```\n\n**while loop:**\n```javascript\nlet i = 0;\nwhile (i < 5) {\n  console.log(i);\n  i++;\n}\n```\n\n**for...of (arrays):**\n```javascript\nfor (const fruit of [\"apple\",\"banana\"]) {\n  console.log(fruit);\n}\n```\n\n**for...in (objects):**\n```javascript\nfor (const key in {a:1,b:2}) {\n  console.log(key); // \"a\", \"b\"\n}\n```\n\n**Try karo:** Print numbers 1 to 10 using a for loop!",
    hi: "**Loops in JavaScript** \ud83d\udd01\n\nLoops = code ko baar baar chalana!\n\n**for loop:**\n```javascript\nfor (let i = 0; i < 5; i++) {\n  console.log(i); // 0,1,2,3,4\n}\n```\n\n**while loop:**\n```javascript\nlet i = 0;\nwhile (i < 5) {\n  console.log(i);\n  i++;\n}\n```\n\n**for...of (arrays ke liye):**\n```javascript\nfor (const fruit of [\"apple\",\"banana\"]) {\n  console.log(fruit);\n}\n```\n\n**Try karo bhai:** for loop se 1 se 10 tak numbers print karo!"
  },

  conditionals: {
    keys: ['if','else','if else','switch','condition','conditional','ternary','comparison','== vs ===','strict equality'],
    en: "**Conditionals in JavaScript** \ud83d\udd00\n\n**if / else:**\n```javascript\nif (age >= 18) {\n  console.log(\"Adult\");\n} else if (age >= 13) {\n  console.log(\"Teen\");\n} else {\n  console.log(\"Kid\");\n}\n```\n\n**Ternary (short if-else):**\n```javascript\nconst status = age >= 18 ? \"Adult\" : \"Minor\";\n```\n\n**switch:**\n```javascript\nswitch(day) {\n  case 1: console.log(\"Monday\"); break;\n  case 2: console.log(\"Tuesday\"); break;\n  default: console.log(\"Other\");\n}\n```\n\n**== vs ===:**\n- `==` compares value only (loose)\n- `===` compares value AND type (strict), always use this\n```javascript\n\"5\" == 5   // true (bad!)\n\"5\" === 5  // false (correct check)\n```\n\n**Try karo:** Write an if-else that checks if a number is even or odd!",
    hi: "**Conditionals in JavaScript** \ud83d\udd00\n\n**if / else:**\n```javascript\nif (age >= 18) {\n  console.log(\"Adult\");\n} else if (age >= 13) {\n  console.log(\"Teen\");\n} else {\n  console.log(\"Kid\");\n}\n```\n\n**Ternary (short if-else):**\n```javascript\nconst status = age >= 18 ? \"Adult\" : \"Minor\";\n```\n\n**== vs === bhai:**\n- `==` sirf value check karta hai (galat)\n- `===` value AND type dono check karta hai, ALWAYS use this\n```javascript\n\"5\" == 5   // true (bura)\n\"5\" === 5  // false (sahi)\n```\n\n**Try karo:** Ek if-else likho jo check kare number even ya odd hai!"
  },

  nodejs: {
    keys: ['node','nodejs','node.js','express','npm','backend','server','rest api','endpoint'],
    en: "**Node.js - Backend with JavaScript** \ud83d\udfe2\n\nNode.js lets you run JavaScript on the server!\n\n**Basic Express server:**\n```javascript\nconst express = require('express');\nconst app = express();\n\napp.get('/api/users', (req, res) => {\n  res.json({ users: ['Aaryan', 'Riya'] });\n});\n\napp.listen(3000, () => console.log('Server running!'));\n```\n\n**npm basics:**\n```bash\nnpm init -y          # create package.json\nnpm install express  # install package\nnpm run dev          # run script\n```\n\n**Key concepts:**\n- **Routes** = URL endpoints (/api/users)\n- **Middleware** = functions that run before route handler\n- **req/res** = request and response objects\n\n**Try karo:** Create an Express server with a /hello route!",
    hi: "**Node.js - JavaScript Backend** \ud83d\udfe2\n\nNode.js se JavaScript server pe chala sakte ho!\n\n**Basic Express server:**\n```javascript\nconst express = require('express');\nconst app = express();\n\napp.get('/api/users', (req, res) => {\n  res.json({ users: ['Aaryan', 'Riya'] });\n});\n\napp.listen(3000, () => console.log('Server chal raha hai!'));\n```\n\n**npm basics:**\n```bash\nnpm init -y\nnpm install express\nnpm run dev\n```\n\n**Yaad rakho:**\n- **Routes** = URL endpoints\n- **Middleware** = route se pehle chalne wala function\n- **req/res** = request aur response\n\n**Try karo:** Express server banao jisme /hello route ho!"
  },

};

// ── MATCH ENGINE ─────────────────────────────────────────────
function findBestMatch(query: string): { topic: string; score: number } | null {
  const q = query.toLowerCase();
  let best: { topic: string; score: number } | null = null;

  for (const [topic, data] of Object.entries(KB)) {
    let score = 0;
    for (const key of data.keys) {
      if (q.includes(key)) {
        score += key.split(' ').length * 2; // multi-word keys score higher
      }
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { topic, score };
    }
  }

  return best;
}

// ── FALLBACK RESPONSES ────────────────────────────────────────
const FALLBACKS = {
  en: [
    `I'm still learning to answer that one! 🙏 But here's what I can help with:\n\n**App topics:** XP, coins, energy, streaks, badges, arena, games, courses, leaderboard\n\n**Coding topics:** JavaScript, HTML, CSS, Python, React, SQL, Git, TypeScript, Data Structures, Closures, Arrays, Objects, Promises, Hooks\n\nTry asking about one of these!`,
    `Hmm, that one's a bit tricky for me right now! Try asking about specific coding concepts like "explain closures" or "what is useEffect" — or app features like "how does XP work"! 🚀`,
  ],
  hi: [
    `Yeh wala main abhi nahi jaanta bhai! 🙏 Lekin yeh sab puch sakte ho:\n\n**App ke baare mein:** XP, coins, energy, streaks, badges, arena, games, courses, leaderboard\n\n**Coding:** JavaScript, HTML, CSS, Python, React, SQL, Git, TypeScript, Data Structures, Closures, Arrays, Promises, Hooks\n\nKisi ek topic pe puch!`,
    `Yeh thoda mushkil hua bhai! Kisi specific topic pe puch — jaise "closures explain karo" ya "XP kaise milta hai" 🚀`,
  ]
};

// ── MAIN FUNCTION ─────────────────────────────────────────────
export function getSubAIResponse(query: string): SubAIResponse {
  const lang = detectLang(query);
  const match = findBestMatch(query);

  if (match && match.score >= 1) {
    const data = KB[match.topic];
    return {
      text: lang === 'hinglish' ? data.hi : data.en,
      confidence: match.score,
    };
  }

  const fallbacks = lang === 'hinglish' ? FALLBACKS.hi : FALLBACKS.en;
  return {
    text: fallbacks[Math.floor(Math.random() * fallbacks.length)],
    confidence: 0,
  };
}
// ── EXTENDED KB ENTRIES (added by upgrade) ────────────────────

// Already defined above; append new topics below if needed.
// The existing KB handles: xp, energy, streak, coins, badges,
// courses, arena, games, leaderboard, variables, functions,
// closures, arrays, objects, promises, reactHooks, css,
// python, git, sql, typescript, dataStructures, html, react,
// debugging.

// Export KB size for debug
export const KB_SIZE = Object.keys(KB).length;
