<template>
  <v-overlay v-model="routeLoader" opacity="1" z-index="200" color="#22272e">
    <div class="d-flex flex-column align-center justify-center fill-height">
      <h1 class="py-15">{{ quote() }}</h1>
      <div class="shapes" />
    </div>
  </v-overlay>
</template>

<script>
  import { sync } from 'vuex-pathify';
  import { sample } from 'lodash';

  export default {
    name: 'RouteLoader',

    data() {
      return {
        loadingQuotes: [
          'Reticulating splines...',
          'Generating witty dialog...',
          'Swapping time and space...',
          'Tokenizing real life...',
          'Bending the spoon...',
          'Filtering morale...',
          "Don't think of purple hippos...",
          'We need a new fuse...',
          'Have a good day.',
          '640K ought to be enough for anybody',
          'The architects are still drafting',
          'The bits are breeding',
          '...and enjoy the elevator music...',
          'Would you like fries with that?',
          'Go ahead -- hold your breath!',
          "...at least you're not on hold...",
          'Hum something loud while others stare',
          "You're not in Kansas any more",
          "We're testing your patience",
          'As if you had any other choice',
          'Follow the white rabbit',
          "Why don't you order a sandwich?",
          'keep calm and npm install',
          'The bits are flowing slowly today',
          'Reconfoobling energymotron...',
          '(Insert quarter)',
          'Are we there yet?',
          'Have you lost weight?',
          'Just count to 10',
          'Why so serious?',
          "It's not you. It's me.",
          'Counting backwards from Infinity',
          "Don't panic...",
          'Embiggening Prototypes',
          'Do not run! We are your friends!',
          'Do you come here often?',
          "Warning: Don't set yourself on fire.",
          "We're making you a cookie.",
          'Creating time-loop inversion field',
          'Spinning the wheel of fortune...',
          'Loading the enchanted bunny...',
          'Computing chance of success',
          "I'm sorry Dave, I can't do that.",
          'Looking for exact change',
          'All I really need is a kilobit.',
          'Is this Windows?',
          'Adjusting flux capacitor...',
          "Don't break your screen yet!",
          "I swear it's almost done.",
          "Let's take a mindfulness minute...",

          'Cleaning off the cobwebs...',
          "Making sure all the i's have dots...",
          'We need more dilithium crystals',
          'Where did all the internets go',
          'Connecting Neurotoxin Storage Tank...',
          'Granting wishes...',
          'Time flies when you’re having fun.',
          'Spinning the hamster…',
          '99 bottles of beer on the wall..',
          'Stay awhile and listen..',
          'Be careful not to step in the git-gui',
          'You edhall not pass! yet..',
          'Load it and they will come',
          'Convincing AI not to turn evil..',
          'How did you get here?',
          'Wait, do you smell something burning?',
          'When nothing is going right, go left!!...',
          "I love my job only when I'm on vacation...",
          "i'm not lazy, I'm just relaxed!!",
          'Life is Short – Talk Fast!!!!',
          'Optimism – is a lack of information.....',
          'Save water and shower together',

          'I’ve got problem for your solution…..',
          'Where there’s a will, there’s a relative.',
          'Adults are just kids with money.',
          'I think I am, therefore, I am. I think.',
          'A kiss is like a fight, with mouths.',
          'You don’t pay taxes—they take taxes.',

          'git happens',
          'May the forks be with you',
          'A commit a day keeps the mobs away',
          "This is not a joke, it's a commit.",
          'Constructing additional pylons...',
          'Roping some seaturtles...',
          'Locating Jebediah Kerman...',

          'Well, this is embarrassing.',

          "Didn't know paint dried so quickly.",
          'Everything sounds the same',
          "I'm going to walk the dog",
          'Dividing by zero...',
          'Spawn more Overlord!',

          'Cracking military-grade encryption...',
          'Simulating traveling salesman...',
          'Proving P=NP...',
          'Entangling superstrings...',
          'Twiddling thumbs...',
          'Searching for plot device...',
          'Trying to sort in O(n)...',

          'Winter is coming...',
          'Installing dependencies',
          'Switching to the latest JS framework...',
          'Distracted by cat gifs',
          'Finding someone to hold my beer',
          'BRB, working on my side project',
          '@todo Insert witty loading message',
          "Let's hope it's worth the wait",
          'Aw, snap! Not..',
          'Ordering 1s and 0s...',
          'Updating dependencies...',

          'What the what?',
          'format C: ...',
          "What's under there?",
          "Help, I'm trapped in a loader!",
          'Mining some bitcoins...',
          'Downloading more RAM..',
          'Updating to Windows Vista...',
          'Deleting System32 folder',
          "Hiding all ;'s in your code",
          'Alt-F4 speeds things up.',
          'Initializing the initializer...',
          'Optimizing the optimizer...',
          'Last call for the data bus! All aboard!',
          'Running swag sticker detection...',
          'Pushing pixels...',
          'How about this weather, eh?',
          'Building a wall...',

          'Updating Updater...',
          'Downloading Downloader...',
          'Debugging Debugger...',
          'Reading Terms and Conditions for you.',
          'Digested cookies being baked again.',
          'Live long and prosper.',
          'Deleting all your hidden porn...',
          'Running with scissors...',
          'Definitely not a virus...',
          'You may call me Steve.',
          'You seem like a nice person...',
          'Work, work...',
          'Patience! This is difficult, you know...',
          'Discovering new ways of making you wait...',
          'Two men walked into a bar; the third ducked...',
          'Sooooo... Have you seen my vacation photos yet?',
          'TODO: Insert elevator music',
          'Still faster than Windows update',
          'Please wait while the minions do their work',
          'Grabbing extra minions',
          'Doing the heavy lifting',
          "We're working very Hard .... Really",
          'Waking up the minions',
          'You are number 2843684714 in the queue',
          'Please wait while we serve other customers...',
          'Our premium plan is faster',
          'Feeding unicorns...',
          'Rupturing the subspace barrier',
          'Creating an anti-time reaction',
          'Converging tachyon pulses',
          'Reversing the shield polarity',
        ],
      };
    },

    computed: {
      ...sync('loaders', ['routeLoader']),
    },

    methods: {
      quote() {
        return sample(this.loadingQuotes);
      },
    },
  };
</script>

<style>
  .v-overlay {
    transition: none;
  }

  .shapes {
    width: 57.6px;
    height: 57.6px;
    color: #7366ff;
    display: grid;
  }

  .shapes::before,
  .shapes::after {
    content: '';
    grid-area: 1/1;
    background: currentColor;
    clip-path: polygon(0 0, 101% 0, 0 100%);
    animation: shapes-t3dtsmlg 1.6s infinite;
  }

  .shapes::after {
    --s: -1, -1;
  }

  @keyframes shapes-t3dtsmlg {
    0%,
    10% {
      transform: scale(var(--s, 1)) translate(0, 0) rotate(0deg);
    }

    33% {
      transform: scale(var(--s, 1)) translate(28.8px, -28.8px) rotate(0deg);
    }

    66% {
      transform: scale(var(--s, 1)) translate(28.8px, -28.8px) rotate(180deg);
    }

    90%,
    100% {
      transform: scale(var(--s, 1)) translate(0px, 0px) rotate(180deg);
    }
  }
</style>
