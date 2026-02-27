import type { ExamenStep, ScripturePassage, IgnatianWeek, Mood } from './types';

export const EXAMEN_STEPS: ExamenStep[] = [
  {
    step: 1,
    title: 'Become Aware of God\'s Presence',
    icon: 'Gratitude',
    description: 'Find a comfortable position. Take a deep breath. Acknowledge that you are in the presence of God, who loves you.',
    prompt: 'What are you grateful for today? List a few things, big or small, that brought you joy or comfort.'
  },
  {
    step: 2,
    title: 'Review the Day with Gratitude',
    icon: 'Review',
    description: 'Walk through your day, from morning to evening, like a movie. Notice the moments where you felt most alive (consolation) and moments where you felt drained or anxious (desolation).',
    prompt: 'What emotions surfaced as you reviewed your day? Where did you feel God\'s presence, and where did God feel distant?'
  },
  {
    step: 3,
    title: 'Pay Attention to One Feature',
    icon: 'Focus',
    description: 'From your review, choose one specific moment, feeling, or interaction from your day to explore more deeply.',
    prompt: 'Describe that one moment in more detail. What happened? Who was there? What did you feel?',
    aiTrigger: true,
  },
  {
    step: 4,
    title: 'Have an Honest Conversation with Jesus',
    icon: 'Conversation',
    description: 'Speak with Jesus as you would a friend about the moment you chose. Share your feelings, thoughts, and questions openly.',
    prompt: 'What do you want to say to Jesus about this moment? What might He be saying to you?',
    aiPromptSource: true
  },
  {
    step: 5,
    title: 'Look Toward Tomorrow with Hope',
    icon: 'Hope',
    description: 'Look to the day to come. Ask God for help and grace for whatever you might face.',
    prompt: 'What is your hope for tomorrow? Is there one area where you desire God\'s help?'
  }
];

export const MOODS: Mood[] = [
    // High Energy, Pleasant (Yellows/Oranges)
    { name: 'Ecstatic', category: 'pleasant', energy: 'high', color: 'bg-yellow-400 text-slate-900 hover:bg-yellow-300', size: 'lg' },
    { name: 'Joyful', category: 'pleasant', energy: 'high', color: 'bg-yellow-400 text-slate-900 hover:bg-yellow-300', size: 'xl' },
    { name: 'Creative', category: 'pleasant', energy: 'high', color: 'bg-orange-400 text-slate-900 hover:bg-orange-300', size: 'md' },
    { name: 'Energized', category: 'pleasant', energy: 'high', color: 'bg-yellow-400 text-slate-900 hover:bg-yellow-300', size: 'lg' },
    { name: 'Playful', category: 'pleasant', energy: 'high', color: 'bg-yellow-400 text-slate-900 hover:bg-yellow-300', size: 'md' },
    { name: 'Focused', category: 'pleasant', energy: 'high', color: 'bg-yellow-400 text-slate-900 hover:bg-yellow-300', size: 'md' },
    { name: 'Happy', category: 'pleasant', energy: 'high', color: 'bg-yellow-400 text-slate-900 hover:bg-yellow-300', size: 'lg' },
    { name: 'Curious', category: 'pleasant', energy: 'high', color: 'bg-orange-400 text-slate-900 hover:bg-orange-300', size: 'sm' },

    // Low Energy, Pleasant (Greens)
    { name: 'Peaceful', category: 'pleasant', energy: 'low', color: 'bg-emerald-400 text-slate-900 hover:bg-emerald-300', size: 'xl' },
    { name: 'Calm', category: 'pleasant', energy: 'low', color: 'bg-emerald-400 text-slate-900 hover:bg-emerald-300', size: 'lg' },
    { name: 'Content', category: 'pleasant', energy: 'low', color: 'bg-teal-400 text-white hover:bg-teal-300', size: 'md' },
    { name: 'Relaxed', category: 'pleasant', energy: 'low', color: 'bg-emerald-400 text-slate-900 hover:bg-emerald-300', size: 'lg' },
    { name: 'Loving', category: 'pleasant', energy: 'low', color: 'bg-teal-400 text-white hover:bg-teal-300', size: 'md' },
    { name: 'Grateful', category: 'pleasant', energy: 'low', color: 'bg-emerald-400 text-slate-900 hover:bg-emerald-300', size: 'md' },
    { name: 'Hopeful', category: 'pleasant', energy: 'low', color: 'bg-emerald-400 text-slate-900 hover:bg-emerald-300', size: 'sm' },
    { name: 'Thoughtful', category: 'pleasant', energy: 'low', color: 'bg-teal-400 text-white hover:bg-teal-300', size: 'sm' },
    
    // High Energy, Unpleasant (Reds/Pinks)
    { name: 'Anxious', category: 'unpleasant', energy: 'high', color: 'bg-red-400 text-white hover:bg-red-300', size: 'xl' },
    { name: 'Angry', category: 'unpleasant', energy: 'high', color: 'bg-red-400 text-white hover:bg-red-300', size: 'lg' },
    { name: 'Stressed', category: 'unpleasant', energy: 'high', color: 'bg-rose-400 text-white hover:bg-rose-300', size: 'md' },
    { name: 'Overwhelmed', category: 'unpleasant', energy: 'high', color: 'bg-red-400 text-white hover:bg-red-300', size: 'lg' },
    { name: 'Frustrated', category: 'unpleasant', energy: 'high', color: 'bg-rose-400 text-white hover:bg-rose-300', size: 'md' },
    { name: 'Afraid', category: 'unpleasant', energy: 'high', color: 'bg-red-400 text-white hover:bg-red-300', size: 'md' },
    { name: 'Annoyed', category: 'unpleasant', energy: 'high', color: 'bg-rose-400 text-white hover:bg-rose-300', size: 'sm' },
    { name: 'Confused', category: 'unpleasant', energy: 'high', color: 'bg-rose-400 text-white hover:bg-rose-300', size: 'sm' },

    // Low Energy, Unpleasant (Blues/Purples)
    { name: 'Sad', category: 'unpleasant', energy: 'low', color: 'bg-sky-400 text-white hover:bg-sky-300', size: 'xl' },
    { name: 'Tired', category: 'unpleasant', energy: 'low', color: 'bg-slate-400 text-white hover:bg-slate-300', size: 'lg' },
    { name: 'Bored', category: 'unpleasant', energy: 'low', color: 'bg-gray-400 text-white hover:bg-gray-300', size: 'md' },
    { name: 'Lonely', category: 'unpleasant', energy: 'low', color: 'bg-sky-400 text-white hover:bg-sky-300', size: 'lg' },
    { name: 'Depressed', category: 'unpleasant', energy: 'low', color: 'bg-indigo-400 text-white hover:bg-indigo-300', size: 'md' },
    { name: 'Apathetic', category: 'unpleasant', energy: 'low', color: 'bg-slate-400 text-white hover:bg-slate-300', size: 'md' },
    { name: 'Guilty', category: 'unpleasant', energy: 'low', color: 'bg-indigo-400 text-white hover:bg-indigo-300', size: 'sm' },
    { name: 'Discouraged', category: 'unpleasant', energy: 'low', color: 'bg-sky-400 text-white hover:bg-sky-300', size: 'sm' },
];


const SCRIPTURE_PASSAGES: { [key: string]: ScripturePassage } = {
    MARK_4: {
        reference: "Mark 4:35-41",
        version: "ESV",
        text: "On that day, when evening had come, he said to them, 'Let us go across to the other side.' And leaving the crowd, they took him with them in the boat, just as he was. And other boats were with him. And a great windstorm arose, and the waves were breaking into the boat, so that the boat was already filling. But he was in the stern, asleep on the cushion. And they woke him and said to him, 'Teacher, do you not care that we are perishing?' And he awoke and rebuked the wind and said to the sea, 'Peace! Be still!' And the wind ceased, and there was a great calm. He said to them, 'Why are you so afraid? Have you still no faith?' And they were filled with great awe and said to one another, 'Who then is this, that even the wind and the sea obey him?'"
    },
    JOHN_4: {
        reference: "John 4:7-10",
        version: "ESV",
        text: "A woman from Samaria came to draw water. Jesus said to her, 'Give me a drink.' (For his disciples had gone away into the city to buy food.) The Samaritan woman said to him, 'How is it that you, a Jew, ask for a drink from me, a woman of Samaria?' (For Jews have no dealings with Samaritans.) Jesus answered her, 'If you knew the gift of God, and who it is that is saying to you, ‘Give me a drink,’ you would have asked him, and he would have given you living water.'"
    },
    LUKE_15: {
        reference: "Luke 15:11-24",
        version: "ESV",
        text: "And he said, 'There was a man who had two sons. And the younger of them said to his father, ‘Father, give me the share of property that is coming to me.’ And he divided his property between them. Not many days later, the younger son gathered all he had and took a journey into a far country, and there he squandered his property in reckless living... But when he came to himself, he said, ‘How many of my father's hired servants have more than enough bread, but I perish here with hunger! I will arise and go to my father, and I will say to him, “Father, I have sinned against heaven and before you...”’ And he arose and came to his father. But while he was still a long way off, his father saw him and felt compassion, and ran and embraced him and kissed him... the father said to his servants, ‘Bring quickly the best robe, and put it on him, and put a ring on his hand, and shoes on his feet. And bring the fattened calf and kill it, and let us eat and celebrate. For this my son was dead, and is alive again; he was lost, and is found.’ And they began to celebrate."
    },
    GENESIS_1: {
        reference: "Genesis 1:26-31",
        version: "ESV",
        text: "Then God said, 'Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky, over the livestock and all the wild animals, and over all the creatures that move along the ground.' So God created mankind in his own image, in the image of God he created them; male and female he created them. God blessed them and said to them, 'Be fruitful and increase in number; fill the earth and subdue it. Rule over the fish in the sea and the birds in the sky and over every living creature that moves on the ground.' Then God said, 'I give you every seed-bearing plant on the face of the whole earth and every tree that has fruit with seed in it. They will be yours for food. And to all the beasts of the earth and all the birds in the sky and all the creatures that move along the ground—everything that has the breath of life in it—I give every green plant for food.' And it was so. God saw all that he had made, and it was very good. And there was evening, and there was morning—the sixth day."
    },
    MATTHEW_4: {
        reference: "Matthew 4:1-11",
        version: "ESV",
        text: "Then Jesus was led by the Spirit into the wilderness to be tempted by the devil. After fasting forty days and forty nights, he was hungry. The tempter came to him and said, 'If you are the Son of God, tell these stones to become bread.' Jesus answered, 'It is written: “Man shall not live on bread alone, but on every word that comes from the mouth of God.”' Then the devil took him to the holy city and had him stand on the highest point of the temple. 'If you are the Son of God,' he said, 'throw yourself down. For it is written: “He will command his angels concerning you, and they will lift you up in their hands, so that you will not strike your foot against a stone.”' Jesus answered him, 'It is also written: “Do not put the Lord your God to the test.”' Again, the devil took him to a very high mountain and showed him all the kingdoms of the world and their splendor. 'All this I will give you,' he said, 'if you will bow down and worship me.' Jesus said to him, 'Away from me, Satan! For it is written: “Worship the Lord your God, and serve him only.”' Then the devil left him, and angels came and attended him."
    },
    KINGS_19: {
        reference: "1 Kings 19:4-9",
        version: "ESV",
        text: "But he himself went a day's journey into the wilderness and came and sat down under a broom tree. And he asked that he might die, saying, 'It is enough; now, O Lord, take away my life, for I am no better than my fathers.' And he lay down and slept under a broom tree. And behold, an angel touched him and said to him, 'Arise and eat.' And he looked, and behold, there was at his head a cake baked on hot stones and a jar of water. And he ate and drank and lay down again. And the angel of the Lord came again a second time and touched him and said, 'Arise and eat, for the journey is too great for you.' And he arose and ate and drank, and went in the strength of that food forty days and forty nights to Horeb, the mount of God. There he came to a cave and lodged in it. And behold, the word of the Lord came to him, and he said to him, 'What are you doing here, Elijah?'"
    },
    LUKE_1: {
        reference: "Luke 1:26-38",
        version: "ESV",
        text: "In the sixth month the angel Gabriel was sent from God to a city of Galilee named Nazareth, to a virgin betrothed to a man whose name was Joseph, of the house of David. And the virgin's name was Mary. And he came to her and said, 'Greetings, O favored one, the Lord is with you!' But she was greatly troubled at the saying, and tried to discern what sort of greeting this might be. And the angel said to her, 'Do not be afraid, Mary, for you have found favor with God. And behold, you will conceive in your womb and bear a son, and you shall call his name Jesus...' And Mary said, 'Behold, I am the servant of the Lord; let it be to me according to your word.' And the angel departed from her."
    },
    MATTHEW_5: {
        reference: "Matthew 5:3-10",
        version: "ESV",
        text: "Blessed are the poor in spirit, for theirs is the kingdom of heaven. Blessed are those who mourn, for they shall be comforted. Blessed are the meek, for they shall inherit the earth. Blessed are those who hunger and thirst for righteousness, for they shall be satisfied. Blessed are the merciful, for they shall receive mercy. Blessed are the pure in heart, for they shall see God. Blessed are the peacemakers, for they shall be called sons of God. Blessed are those who are persecuted for righteousness' sake, for theirs is the kingdom of heaven."
    },
    MATTHEW_13: {
        reference: "Matthew 13:44-46",
        version: "ESV",
        text: "The kingdom of heaven is like treasure hidden in a field, which a man found and covered up. Then in his joy he goes and sells all that he has and buys that field. Again, the kingdom of heaven is like a merchant in search of fine pearls, who, on finding one pearl of great value, went and sold all that he had and bought it."
    },
    JOHN_13: {
        reference: "John 13:1-15",
        version: "ESV",
        text: "Now before the Feast of the Passover, when Jesus knew that his hour had come to depart out of this world to the Father, having loved his own who were in the world, he loved them to the end... he laid aside his outer garments, and taking a towel, tied it around his waist. Then he poured water into a basin and began to wash the disciples' feet and to wipe them with the towel that was wrapped around him... When he had washed their feet and put on his outer garments and resumed his place, he said to them, 'Do you understand what I have done to you? You call me Teacher and Lord, and you are right, for so I am. If I then, your Lord and Teacher, have washed your feet, you also ought to wash one another's feet. For I have given you an example, that you also should do as I have done to you.'"
    },
    LUKE_22: {
        reference: "Luke 22:39-46",
        version: "ESV",
        text: "And he came out and went, as was his custom, to the Mount of Olives, and the disciples followed him. And when he came to the place, he said to them, 'Pray that you may not enter into temptation.' And he withdrew from them about a stone's throw, and knelt down and prayed, saying, 'Father, if you are willing, remove this cup from me. Nevertheless, not my will, but yours, be done.' And there appeared to him an angel from heaven, strengthening him. And being in an agony he prayed more earnestly; and his sweat became like great drops of blood falling down to the ground. And when he rose from prayer, he came to the disciples and found them sleeping for sorrow, and he said to them, 'Why are you sleeping? Rise and pray that you may not enter into temptation.'"
    },
    JOHN_19: {
        reference: "John 19:25-30",
        version: "ESV",
        text: "but standing by the cross of Jesus were his mother and his mother's sister, Mary the wife of Clopas, and Mary Magdalene. When Jesus saw his mother and the disciple whom he loved standing nearby, he said to his mother, 'Woman, behold, your son!' Then he said to the disciple, 'Behold, your mother!' And from that hour the disciple took her to his own home. After this, Jesus, knowing that all was now finished, said (to fulfill the Scripture), 'I thirst.' A jar full of sour wine stood there, so they put a sponge full of the sour wine on a hyssop branch and held it to his mouth. When Jesus had received the sour wine, he said, 'It is finished,' and he bowed his head and gave up his spirit."
    },
    LUKE_24: {
        reference: "Luke 24:13-32",
        version: "ESV",
        text: "That very day two of them were going to a village named Emmaus, about seven miles from Jerusalem, and they were talking with each other about all these things that had happened. While they were talking and discussing together, Jesus himself drew near and went with them. But their eyes were kept from recognizing him... And he said to them, 'O foolish ones, and slow of heart to believe all that the prophets have spoken! Was it not necessary that the Christ should suffer these things and enter into his glory?' And beginning with Moses and all the Prophets, he interpreted to them in all the Scriptures the things concerning himself... As they drew near to the village to which they were going, he acted as if he were going farther, but they urged him strongly, saying, 'Stay with us, for it is toward evening and the day is now far spent.' So he went in to stay with them. When he was at table with them, he took the bread and blessed and broke it and gave it to them. And their eyes were opened, and they recognized him. And he vanished from their sight. They said to each other, 'Did not our hearts burn within us while he talked to us on the road, while he opened to us the Scriptures?'"
    },
    JOHN_21: {
        reference: "John 21:15-19",
        version: "ESV",
        text: "When they had finished breakfast, Jesus said to Simon Peter, 'Simon, son of John, do you love me more than these?' He said to him, 'Yes, Lord; you know that I love you.' He said to him, 'Feed my lambs.' He said to him a second time, 'Simon, son of John, do you love me?' He said to him, 'Yes, Lord; you know that I love you.' He said to him, 'Tend my sheep.' He said to him the third time, 'Simon, son of John, do you love me?' Peter was grieved because he said to him the third time, 'Do you love me?' and he said to him, 'Lord, you know everything; you know that I love you.' Jesus said to him, 'Feed my sheep... Follow me.'"
    },
    ROMANS_12: {
        reference: "Romans 12:1-2",
        version: "ESV",
        text: "I appeal to you therefore, brothers, by the mercies of God, to present your bodies as a living sacrifice, holy and acceptable to God, which is your spiritual worship. Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect."
    }
};

export const IGNATIAN_JOURNEY: IgnatianWeek[] = [
    // MONTH 1: THE FIRST WEEK - FOUNDATIONS
    {
        week: 1,
        title: "The Foundation of Our Journey",
        lesson: {
          title: "The First Principle and Foundation",
          content: "St. Ignatius begins with a foundational truth: we are created by God, out of love, and for love. Our ultimate purpose is to praise, reverence, and serve God, and by this means to save our souls. Everything else in the world is a gift, a tool to help us reach this end. This week, we practice 'indifference'—not apathy, but a deep interior freedom, choosing only what helps us grow closer to God."
        },
        scripture: SCRIPTURE_PASSAGES.GENESIS_1,
        examenFocus: "As you review your day, pay special attention to moments of simple gratitude. Where did you notice God's gifts, big or small?"
    },
    {
        week: 2,
        title: "God's Unconditional Mercy",
        lesson: {
          title: "An Introduction to Discernment",
          content: "Before diving into the 'rules,' we must first understand that God is always communicating with us through the movements of our hearts—our desires, feelings, and thoughts. Discernment is the prayerful practice of noticing these movements and learning to distinguish God's voice from other 'voices' within and around us. It's less about finding a magic answer and more about walking in closer relationship with Jesus."
        },
        scripture: SCRIPTURE_PASSAGES.LUKE_15,
        examenFocus: "When reviewing your emotions today, gently notice any moments of strong feeling—joy, sadness, peace, or anxiety. Without judgment, simply bring these feelings into your conversation with Jesus."
    },
    {
        week: 3,
        title: "The Two Spirits",
        lesson: {
          title: "The Reality of Spiritual Influence",
          content: "Ignatian spirituality acknowledges that we are influenced by two opposing spirits. The 'Good Spirit' (the Holy Spirit) leads us toward faith, hope, and love, bringing peace and energy. The 'Enemy' (or evil spirit) seeks to lead us into doubt, despair, and isolation, often through lies and discouragement. The first step in discernment is simply recognizing that these two distinct influences are real and active in our daily lives."
        },
        scripture: SCRIPTURE_PASSAGES.MATTHEW_4,
        examenFocus: "As you review your day, can you identify a thought or feeling that led you toward peace (Good Spirit) and another that led toward anxiety or discouragement (Enemy)?"
    },
    {
        week: 4,
        title: "Recognizing the Enemy's Playbook",
        lesson: {
          title: "Rule 1: For Those Moving Away from God",
          content: "St. Ignatius observes that when a person is living in serious sin, the enemy's tactic is to propose apparent pleasures. He whispers, 'This is fine, everyone does it, it's not a big deal,' making sin seem attractive and consequences seem distant. The Good Spirit does the opposite, stirring the conscience with remorse and a healthy sense of guilt to bring the person back to God."
        },
        scripture: SCRIPTURE_PASSAGES.LUKE_15,
        examenFocus: "Reflect on a past time when you were moving away from God. How did temptation present itself? Can you recognize the 'apparent pleasures' the enemy proposed?"
    },
    // MONTH 2: THE FIRST WEEK - RULES FOR DISCERNMENT
    {
        week: 5,
        title: "Recognizing the Spirit's Nudges",
        lesson: {
          title: "Rule 2: For Those Moving Toward God",
          content: "For those who are earnestly trying to follow God, the roles are reversed. The enemy becomes the accuser. He brings sadness, anxiety, and obstacles, whispering, 'You're not good enough, this is too hard, you'll never change.' The Good Spirit does the opposite, giving courage, strength, encouragement, and peace to help us persevere in doing good."
        },
        scripture: SCRIPTURE_PASSAGES.MATTHEW_4,
        examenFocus: "As you try to grow closer to God this week, notice any discouraging thoughts that arise. Are they gentle invitations from God to grow, or are they harsh accusations from the enemy? Bring them to Jesus."
    },
    {
        week: 6,
        title: "The Gift of Consolation",
        lesson: {
          title: "Rule 3: What is Spiritual Consolation?",
          content: "Spiritual Consolation is an interior movement that draws us closer to God. It can be an increase in faith, hope, and love. It's a sense of peace, joy, and quiet confidence that comes from God. This isn't just a fleeting good mood; it's a deep-seated feeling of connection to God and a desire for heavenly things. It's a gift that strengthens and encourages us on our journey."
        },
        scripture: SCRIPTURE_PASSAGES.JOHN_4,
        examenFocus: "Look for a moment of true spiritual consolation today. It might be subtle. What did it feel like? Thank God for this gift of His presence."
    },
    {
        week: 7,
        title: "The Trial of Desolation",
        lesson: {
          title: "Rule 4: What is Spiritual Desolation?",
          content: "Spiritual Desolation is the opposite of consolation. It's a darkness of the soul, a feeling of turmoil, and a sense of being separated from God. We can feel agitated, sad, and tempted to give up on spiritual things. It's important to know that desolation is not a sign of God's absence, but a trial. The enemy uses these moments to make us doubt and despair. Everyone experiences desolation; the key is learning how to respond."
        },
        scripture: SCRIPTURE_PASSAGES.KINGS_19,
        examenFocus: "If you experienced any desolation today, gently name it in your prayer. Notice the thoughts and feelings that came with it. Ask Jesus to be with you in that darkness, just as the angel was with Elijah."
    },
    {
        week: 8,
        title: "Standing Firm in the Storm",
        lesson: {
          title: "Rule 5: In Desolation, Make No Change",
          content: "This is one of the most crucial and practical rules. When you are in a state of spiritual desolation, never make a major decision or change a previous resolution. The enemy is clouding your judgment with negativity and lies. Your perspective is skewed. The wise thing to do is to hold firm to the decisions you made when you were in consolation and wait for the desolation to pass before making any significant changes."
        },
        scripture: SCRIPTURE_PASSAGES.MARK_4,
        examenFocus: "Today, if you feel desolation, practice 'making no change.' Simply stay faithful to your commitments to prayer and goodness, trusting that God is with you in the boat, even if He seems asleep. What does it feel like to wait with trust?"
    },
    // MONTH 3: THE SECOND WEEK - FOLLOWING JESUS
    {
        week: 9,
        title: "The Call of the King",
        lesson: {
            title: "Responding to Christ's Invitation",
            content: "The Second Week of the Exercises begins with a meditation on a noble king who calls subjects to join him in a great quest. We then apply this to Christ: Jesus, the eternal King, calls each of us personally to join Him in His mission to bring love and healing to the world. The question for us is: how will we respond to this personal invitation?"
        },
        scripture: SCRIPTURE_PASSAGES.MATTHEW_13,
        examenFocus: "As you pray today, imagine Jesus looking at you with love and personally inviting you to follow Him more closely. What feelings does this invitation stir in you?"
    },
    {
        week: 10,
        title: "The Incarnation",
        lesson: {
            title: "God With Us",
            content: "We contemplate the Trinity looking down upon a world full of chaos and darkness, and in an act of infinite love, deciding to send the Son to become human. We then imagine the humble scene in Nazareth with Mary. This is not just a historical event, but a present reality: God chooses to enter into the messiness of our lives, right here, right now."
        },
        scripture: SCRIPTURE_PASSAGES.LUKE_1,
        examenFocus: "Notice the small, humble, and ordinary places in your day. Can you imagine God choosing to be present with you right there, in those specific moments?"
    },
    {
        week: 11,
        title: "The Nativity",
        lesson: {
            title: "Poverty and Humility",
            content: "We place ourselves at the scene of Jesus' birth in Bethlehem. We see the poverty, the cold, the inconvenience. The King of the Universe enters the world in complete vulnerability. This challenges our values of comfort, power, and security. God reveals His glory in humility."
        },
        scripture: {reference: "Luke 2:1-14", version: "ESV", text: "In those days a decree went out from Caesar Augustus that all the world should be registered... And Joseph also went up from Galilee, from the town of Nazareth, to Judea, to the city of David, which is called Bethlehem... to be registered with Mary, his betrothed, who was with child. And while they were there, the time came for her to give birth. And she gave birth to her firstborn son and wrapped him in swaddling cloths and laid him in a manger, because there was no place for them in the inn..."},
        examenFocus: "Where did you encounter 'poverty' today—not just financial, but moments of limitation, weakness, or dependence on others? How might Jesus be present in those places?"
    },
    {
        week: 12,
        title: "The Hidden Life",
        lesson: {
            title: "Finding God in the Ordinary",
            content: "We contemplate the years Jesus spent in Nazareth, living an ordinary life of work, family, and community. There were no public miracles, no great speeches. This teaches us that our daily, hidden lives—our work, our chores, our relationships—are profoundly important and are the primary place where we live out our response to God's call."
        },
        scripture: {reference: "Luke 2:41-52", version: "ESV", text: "Now his parents went to Jerusalem every year at the Feast of the Passover... And when he was twelve years old, they went up according to custom... the boy Jesus stayed behind in Jerusalem. His parents did not know it... After three days they found him in the temple, sitting among the teachers, listening to them and asking them questions... And he went down with them and came to Nazareth and was submissive to them... And Jesus increased in wisdom and in stature and in favor with God and man."},
        examenFocus: "Pay attention to the most 'ordinary' part of your day. Can you offer this simple time to God and look for His presence within it?"
    },
    // MONTH 4: THE SECOND WEEK - THE TWO STANDARDS
    {
        week: 13,
        title: "The Two Standards",
        lesson: {
            title: "Two Ways to Live",
            content: "Ignatius presents a powerful meditation: imagine two opposing armies. One is led by Christ, whose standard is humility, poverty, and love. The other is led by Lucifer, whose standard is riches, honor, and pride. We are all on this battlefield. This meditation isn't to scare us, but to clarify the choice before us: which leader will we follow? Which values will guide our lives?"
        },
        scripture: SCRIPTURE_PASSAGES.MATTHEW_4,
        examenFocus: "Notice the 'standards' presented to you today by the world (through ads, media, conversations). Then, notice the 'standard' Jesus presents in the Gospel. Where do they conflict in your own heart?"
    },
    {
        week: 14,
        title: "The Three Kinds of Humility",
        lesson: {
            title: "Deepening Our Yes",
            content: "Building on the Two Standards, Ignatius describes three levels of response to God. The first is basic obedience. The second is a deeper desire to be free from attachment to riches or honor. The third, and most profound, is the desire to choose what Christ chose: to embrace humility and even insults, if it means being closer to Him. This is the heart of a disciple."
        },
        scripture: SCRIPTURE_PASSAGES.JOHN_13,
        examenFocus: "Where did you have an opportunity to choose humility today? It might be as simple as listening to someone else's opinion or admitting a mistake. What did that choice feel like?"
    },
    {
        week: 15,
        title: "The Sermon on the Mount",
        lesson: {
            title: "The Values of the Kingdom",
            content: "We spend time with Jesus as he teaches the Beatitudes. These are not just nice ideals; they are a radical description of what a life lived under God's rule looks like. They turn the world's values upside down. To be 'poor in spirit,' 'meek,' or 'merciful' is to be truly blessed in God's Kingdom."
        },
        scripture: SCRIPTURE_PASSAGES.MATTHEW_5,
        examenFocus: "Choose one of the Beatitudes. Look for a situation in your day where you could have lived it out more fully. What would that have looked like?"
    },
    {
        week: 16,
        title: "Jesus Heals",
        lesson: {
            title: "Encountering the Compassion of Christ",
            content: "We contemplate the various healing miracles of Jesus. We place ourselves in the scene, perhaps as the person being healed, or as a bystander in the crowd. We see Jesus' compassion, His power, and His desire to make people whole. We are invited to bring our own areas of brokenness and woundedness to Him for healing."
        },
        scripture: {reference: "Mark 5:25-34", version: "ESV", text: "And there was a woman who had had a discharge of blood for twelve years... She had heard the reports about Jesus and came up behind him in the crowd and touched his garment. For she said, 'If I touch even his garments, I will be made well.' And immediately the flow of blood dried up... And Jesus, perceiving in himself that power had gone out from him, immediately turned about in the crowd and said, 'Who touched my garments?'... But the woman, knowing what had happened to her, came in fear and trembling and fell down before him and told him the whole truth. And he said to her, 'Daughter, your faith has made you well; go in peace, and be healed of your disease.'"},
        examenFocus: "What part of you is in need of healing today (physical, emotional, spiritual)? Imagine bringing that need to Jesus and allowing Him to look upon you with compassion."
    },
    // MONTH 5: THE SECOND WEEK - MAKING CHOICES
    {
        week: 17,
        title: "The Call of the Disciples",
        lesson: {
            title: "The Simplicity of 'Follow Me'",
            content: "We watch as Jesus calls Peter, Andrew, James, and John. They are ordinary fishermen at their daily work. The call is simple and direct: 'Follow me.' Their response is immediate; they leave everything. This meditation invites us to hear that same call in our own ordinary lives and to consider what we might need to 'leave behind' to follow Jesus more freely."
        },
        scripture: {reference: "Mark 1:16-20", version: "ESV", text: "Passing alongside the Sea of Galilee, he saw Simon and Andrew the brother of Simon casting a net into the sea, for they were fishermen. And Jesus said to them, 'Follow me, and I will make you become fishers of men.' And immediately they left their nets and followed him. And going on a little farther, he saw James the son of Zebedee and John his brother, who were in their boat mending the nets. And immediately he called them, and they left their father Zebedee in the boat with the hired servants and followed him."},
        examenFocus: "If Jesus were to walk into your workplace or home today and say 'Follow me,' what would your gut reaction be? What 'nets' might you be holding onto?"
    },
    {
        week: 18,
        title: "Discerning a Decision",
        lesson: {
            title: "Making an 'Election'",
            content: "The fruit of the Second Week is the 'Election'—making a significant choice in alignment with God's will. This isn't about one-size-fits-all rules, but about prayerfully considering our options in light of our foundational purpose and the example of Christ. We use the tools of discernment—noticing consolation and desolation—to guide us toward the choice that leads to greater love and service."
        },
        scripture: SCRIPTURE_PASSAGES.ROMANS_12,
        examenFocus: "Consider a small choice you made today. What was your motivation? Was it rooted in love and service, or in fear and self-interest? Talk to Jesus about this without judgment."
    },
    {
        week: 19,
        title: "Rules for the Second Week",
        lesson: {
            title: "Discerning Subtle Temptations",
            content: "St. Ignatius provides a second set of rules for discerning more subtle temptations. When we are firmly on God's path, the enemy doesn't tempt us with obvious evil. Instead, he might appear as an 'angel of light,' suggesting something that seems good but leads us away from peace, or causing 'consolation without a cause' that ends in distraction. We learn to test the spirits more carefully."
        },
        scripture: {reference: "2 Corinthians 11:13-15", version: "ESV", text: "For such men are false apostles, deceitful workmen, disguising themselves as apostles of Christ. And no wonder, for even Satan disguises himself as an angel of light. So it is no surprise if his servants, also, disguise themselves as servants of righteousness. Their end will correspond to their deeds."},
        examenFocus: "Review a 'good idea' or positive feeling you had today. Where did it ultimately lead you—toward greater peace and charity, or toward subtle anxiety or self-focus? This is the test of spirits."
    },
    {
        week: 20,
        title: "Confirming a Choice",
        lesson: {
            title: "Peace as a Signpost",
            content: "After making a prayerful decision, we look for confirmation. A key sign that a choice is from God is a deep, abiding sense of peace and consolation, even if the path ahead is difficult. If a choice leads to persistent desolation and inner turmoil, it may be a sign that we need to reconsider and pray further. God's will, while challenging, ultimately leads to life and peace."
        },
        scripture: SCRIPTURE_PASSAGES.JOHN_4,
        examenFocus: "Think about a good decision you've made in the past. Can you recall the sense of peace or 'rightness' that followed? Thank God for that confirmation."
    },
    // MONTH 6: THE THIRD WEEK - THE PASSION
    {
        week: 21,
        title: "The Last Supper",
        lesson: {
            title: "The Gift of the Eucharist",
            content: "We enter the Third Week by sitting with Jesus and his disciples at the Last Supper. We watch him take the bread and wine, giving himself to them and to us in the Eucharist. We see him wash their feet, a radical act of servant leadership. We are invited to receive this immense gift of His presence and to follow His example of selfless love."
        },
        scripture: SCRIPTURE_PASSAGES.JOHN_13,
        examenFocus: "Reflect on an act of service you witnessed or performed today. How was Christ's selfless love present in that moment?"
    },
    {
        week: 22,
        title: "The Agony in the Garden",
        lesson: {
            title: "Praying in Our Own Gethsemane",
            content: "We accompany Jesus to the Garden of Gethsemane. We witness his anguish, his fear, and his profound struggle to align his will with the Father's. This is a prayer of solidarity. We are invited to bring our own fears and struggles to Jesus, knowing that He understands them completely. We learn from Him how to pray, 'Not my will, but yours, be done.'"
        },
        scripture: SCRIPTURE_PASSAGES.LUKE_22,
        examenFocus: "When you felt anxious or fearful today, did you turn toward God or away from Him? Imagine Jesus sitting with you in that feeling, just as the angel strengthened him."
    },
    {
        week: 23,
        title: "The Arrest and Trials",
        lesson: {
            title: "Jesus Amidst Injustice",
            content: "We watch as Jesus is betrayed, arrested, and subjected to unjust trials. We see his dignity and silence in the face of false accusations. We feel the injustice and cruelty of the situation. This contemplation calls us to consider our own reactions to injustice and how we can stand with Christ and those who suffer unjustly in our world."
        },
        scripture: {reference: "Mark 14:53-65", version: "ESV", text: "And they led Jesus to the high priest... And the chief priests and the whole council were seeking testimony against Jesus to put him to death, but they found none... And some began to spit on him and to cover his face and to strike him, saying to him, 'Prophesy!' And the guards received him with blows."},
        examenFocus: "Where did you see injustice, big or small, in the world or in your own life today? Talk to Jesus about the anger or helplessness you feel."
    },
    {
        week: 24,
        title: "The Scourging and Crowning with Thorns",
        lesson: {
            title: "The Suffering of the Innocent",
            content: "We contemplate the physical suffering of Jesus. The goal is not to be morbid, but to be struck with the depth of God's love, that He would endure such pain for our sake. We ask for the grace to feel sorrow and compassion, not out of guilt, but out of a loving recognition of the cost of our sin and the immensity of His mercy."
        },
        scripture: {reference: "John 19:1-3", version: "ESV", text: "Then Pilate took Jesus and flogged him. And the soldiers twisted together a crown of thorns and put it on his head and arrayed him in a purple robe. They came up to him, saying, 'Hail, King of the Jews!' and struck him with their hands."},
        examenFocus: "Reflect on a time you caused pain to another, intentionally or not. Bring that memory to the foot of the cross and ask for the grace of compassion and reconciliation."
    },
    // MONTH 7: THE THIRD WEEK - THE CROSS
    {
        week: 25,
        title: "Carrying the Cross",
        lesson: {
            title: "Walking with Jesus to Calvary",
            content: "We walk alongside Jesus on the road to Calvary. We see him fall, we see Simon of Cyrene help him, we see the women weeping. We are not just spectators. We are invited to consider our own crosses, the burdens and sufferings we carry. Do we carry them with Him, or do we struggle alone? Do we help others carry their crosses?"
        },
        scripture: {reference: "Luke 23:26-31", version: "ESV", text: "And as they led him away, they seized one Simon of Cyrene, who was coming in from the country, and laid on him the cross, to carry it behind Jesus. And there followed him a great multitude of the people and of women who were mourning and lamenting for him."},
        examenFocus: "What was the heaviest 'cross' you had to carry today? Did you feel alone in it, or did you sense the presence of Jesus or a 'Simon' helping you?"
    },
    {
        week: 26,
        title: "The Crucifixion",
        lesson: {
            title: "Behold, the Lamb of God",
            content: "We stand at the foot of the cross with Mary and John. We gaze upon Jesus. We listen to his last words. We are here not to analyze, but to be present to the mystery of sacrificial love. We ask for the grace to understand, in our hearts, the depth of what is happening: God's love for the world, poured out to the very end."
        },
        scripture: SCRIPTURE_PASSAGES.JOHN_19,
        examenFocus: "As you stood at the foot of the cross in your imagination, what was your dominant feeling? Gratitude? Sorrow? Awe? Share this honestly with Jesus."
    },
    {
        week: 27,
        title: "His Death and Burial",
        lesson: {
            title: "Holy Saturday",
            content: "We contemplate the silence of Holy Saturday. Jesus is in the tomb. The world seems to have gone dark. There is a sense of waiting, of emptiness. This is a prayer for times when God feels absent, when our hopes seem to have died. We learn to wait in hope, trusting that this is not the end of the story."
        },
        scripture: {reference: "Matthew 27:57-61", version: "ESV", text: "When it was evening, there came a rich man from Arimathea, named Joseph, who also was a disciple of Jesus. He went to Pilate and asked for the body of Jesus... And Joseph took the body and wrapped it in a clean linen shroud and laid it in his own new tomb, which he had cut in the rock. And he rolled a great stone to the entrance of the tomb and went away."},
        examenFocus: "Have you had a 'Holy Saturday' experience in your life? A time of waiting in darkness? Reflect on how God was present even in that silence."
    },
    {
        week: 28,
        title: "Reviewing the Third Week",
        lesson: {
            title: "The Graces of the Passion",
            content: "We look back over our prayer on the Passion of Jesus. What has moved us? What graces have we received? The goal of the Third Week is not to leave us in sadness, but to deepen our love for Jesus, to grow in compassion for others who suffer, and to be profoundly grateful for the gift of our salvation."
        },
        scripture: {reference: "Isaiah 53:4-5", version: "ESV", text: "Surely he has borne our griefs and carried our sorrows; yet we esteemed him stricken, smitten by God, and afflicted. But he was pierced for our transgressions; he was crushed for our iniquities; upon him was the chastisement that brought us peace, and with his wounds we are healed."},
        examenFocus: "As you look back on this week's prayer, what is the one insight or feeling about Jesus' love that you want to carry forward with you?"
    },
    // MONTH 8: THE FOURTH WEEK - THE RESURRECTION
    {
        week: 29,
        title: "The Resurrection",
        lesson: {
            title: "He is Risen!",
            content: "We move from the darkness of the tomb to the brilliant light of the Resurrection. We go with the women to the empty tomb and hear the angel's stunning news. The Fourth Week is all about joy, consolation, and hope. We ask for the grace to share in Christ's joy, to truly believe that love is stronger than death, and that new life is always possible."
        },
        scripture: {reference: "John 20:1-18", version: "ESV", text: "Now on the first day of the week Mary Magdalene came to the tomb early, while it was still dark, and saw that the stone had been taken away from the tomb... she turned around and saw Jesus standing, but she did not know that it was Jesus. Jesus said to her, 'Woman, why are you weeping? Whom are you seeking?'... Jesus said to her, 'Mary.' She turned and said to him in Aramaic, 'Rabboni!' (which means Teacher)."},
        examenFocus: "Where did you see signs of 'new life' or hope in your day today, however small? Celebrate these moments of resurrection."
    },
    {
        week: 30,
        title: "The Appearance to the Disciples",
        lesson: {
            title: "Peace Be With You",
            content: "We contemplate the Risen Jesus appearing to his fearful disciples, hiding in the upper room. His first words are 'Peace be with you.' He shows them his wounds—not to prove a point, but to show that his glorified body is the same body that suffered. Our own wounds are not erased, but can be transformed in him. He then breathes on them, giving them the Holy Spirit."
        },
        scripture: {reference: "John 20:19-23", version: "ESV", text: "On the evening of that day, the first day of the week, the doors being locked where the disciples were for fear of the Jews, Jesus came and stood among them and said to them, 'Peace be with you.' When he had said this, he showed them his hands and his side. Then the disciples were glad when they saw the Lord."},
        examenFocus: "When you felt fear or anxiety today, what would it have been like to have the Risen Jesus appear and say to you, 'Peace be with you'?"
    },
    {
        week: 31,
        title: "The Road to Emmaus",
        lesson: {
            title: "Recognizing Him in the Breaking of the Bread",
            content: "This is one of the most beautiful resurrection stories. The disciples are walking away from Jerusalem, discouraged and sad. Jesus walks with them, but they don't recognize him. He opens the Scriptures to them, and their hearts begin to burn. But it is only in the simple, familiar act of breaking bread that their eyes are opened. We learn that we often meet the Risen Lord in community, in Scripture, and in the Eucharist."
        },
        scripture: SCRIPTURE_PASSAGES.LUKE_24,
        examenFocus: "Reflect on a time when a conversation with a friend, or hearing a passage of scripture, suddenly made things clear for you. How was that a 'Road to Emmaus' moment?"
    },
    {
        week: 32,
        title: "The Appearance to Thomas",
        lesson: {
            title: "From Doubt to Faith",
            content: "We are with Thomas in his doubt. He needs proof. Jesus does not scold him; instead, he meets him right where he is, in his need for tangible evidence. He invites Thomas to touch his wounds. Thomas's response is the greatest profession of faith in the Gospels: 'My Lord and my God!' This gives us permission to bring our own doubts and questions to Jesus, trusting He will meet us there."
        },
        scripture: {reference: "John 20:24-29", version: "ESV", text: "Now Thomas, one of the Twelve, called the Twin, was not with them when Jesus came... he said to them, 'Unless I see in his hands the mark of the nails, and place my finger into the mark of the nails, and place my hand into his side, I will never believe.'... Jesus came... and said to Thomas, 'Put your finger here, and see my hands; and put out your hand, and place it in my side. Do not disbelieve, but believe.' Thomas answered him, 'My Lord and my God!'"},
        examenFocus: "What is one doubt or question you have in your faith right now? Imagine presenting it honestly to Jesus and letting him respond to you as he did to Thomas."
    },
    // MONTH 9: THE FOURTH WEEK - MISSION
    {
        week: 33,
        title: "The Breakfast on the Beach",
        lesson: {
            title: "Do You Love Me?",
            content: "Jesus appears to the disciples by the Sea of Galilee. He makes them breakfast, a simple act of care. Then he takes Peter, who had denied him three times, and asks him three times, 'Do you love me?' This is not a test, but a healing. It restores Peter and commissions him for his mission: 'Feed my sheep.' Our own mission flows not from our perfection, but from our restored relationship with the one who forgives and trusts us."
        },
        scripture: SCRIPTURE_PASSAGES.JOHN_21,
        examenFocus: "Imagine Jesus asking you today, in the midst of your ordinary life, 'Do you love me?' What is your honest, heartfelt answer?"
    },
    {
        week: 34,
        title: "The Ascension",
        lesson: {
            title: "Sent into the World",
            content: "We contemplate Jesus's final appearance, where he gives the great commission to 'go and make disciples of all nations.' Then he ascends into heaven. This is not an ending, but a new beginning. He entrusts His mission to us. We are now his hands, his feet, his heart in the world. He doesn't leave us alone, but promises the Holy Spirit to empower us."
        },
        scripture: {reference: "Matthew 28:16-20", version: "ESV", text: "Now the eleven disciples went to Galilee, to the mountain to which Jesus had directed them. And when they saw him they worshiped him, but some doubted. And Jesus came and said to them, 'All authority in heaven and on earth has been given to me. Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you. And behold, I am with you always, to the end of the age.'"},
        examenFocus: "What is one small way you can be Christ's 'hands and feet' in your world tomorrow?"
    },
    {
        week: 35,
        title: "Reviewing the Fourth Week",
        lesson: {
            title: "The Graces of the Resurrection",
            content: "We look back over our prayer on the Risen Christ. The primary grace of this week is one of intense joy and consolation. We have seen that love triumphs over death, forgiveness overcomes betrayal, and hope shines in the darkness. We ask that this deep, Christ-centered joy will become a lasting part of our lives."
        },
        scripture: SCRIPTURE_PASSAGES.LUKE_24,
        examenFocus: "What has been the greatest source of joy or consolation for you during this time of praying with the Risen Christ?"
    },
    {
        week: 36,
        title: "The Contemplation to Attain Love",
        lesson: {
            title: "Finding God in All Things",
            content: "This is the capstone of the Spiritual Exercises. We shift our focus from events in Jesus's life to recognizing God's active, loving presence in all of creation and in our own lives, right now. We reflect on all the gifts God has given us, how He dwells within us and all things, and how He is constantly working for our good. Our response is one of total self-offering in gratitude."
        },
        scripture: {reference: "Acts 17:27-28", version: "ESV", text: "that they should seek God, and perhaps feel their way toward him and find him. Yet he is actually not far from each one of us, for ‘In him we live and move and have our being’; as even some of your own poets have said, ‘For we are indeed his offspring.’"},
        examenFocus: "Look at your day through the lens of 'finding God in all things.' Where did you see God's presence or laboring in the world around you—in nature, in other people, in your own work?"
    },
    // MONTH 10: INTEGRATION AND LIVING THE FOURTH WEEK
    {
        week: 37,
        title: "The First Point: Recalling Gifts",
        lesson: {
            title: "Gratitude as a Way of Life",
            content: "The first part of the Contemplation to Attain Love is to recall the countless gifts we have received from God: creation, life, family, redemption, our unique talents. We are not meant to just make a list, but to savor these gifts, letting them stir our hearts to profound gratitude. Gratitude becomes the foundation of our ongoing relationship with God."
        },
        scripture: SCRIPTURE_PASSAGES.GENESIS_1,
        examenFocus: "Today, focus on one specific gift from God you often take for granted. Spend a moment in your prayer simply savoring that gift and thanking the Giver."
    },
    {
        week: 38,
        title: "The Second Point: God Dwells in Me",
        lesson: {
            title: "The Temple of the Holy Spirit",
            content: "We move from seeing God's gifts 'out there' to recognizing His presence 'in here.' We reflect on the truth that God makes His home within us. We are temples of the Holy Spirit. This is a staggering reality that should fill us with awe and reverence for ourselves and for others. God is not distant; He is as close as our own breath."
        },
        scripture: {reference: "1 Corinthians 6:19-20", version: "ESV", text: "Or do you not know that your body is a temple of the Holy Spirit within you, whom you have from God? You are not your own, for you were bought with a price. So glorify God in your body."},
        examenFocus: "Throughout your day, try to gently recall the truth: 'God dwells in me.' How does this awareness change how you see yourself or how you act?"
    },
    {
        week: 39,
        title: "The Third Point: God Labors for Me",
        lesson: {
            title: "The Active God",
            content: "We look at the world around us—from the stars in the sky to the people we meet—and see God actively at work, sustaining, creating, and laboring for our good in every moment. He is not a passive observer. He is the divine worker, constantly pouring out His love and energy into creation. We are invited to join Him in His work."
        },
        scripture: SCRIPTURE_PASSAGES.JOHN_4,
        examenFocus: "Look at one simple object near you. Contemplate how God is actively working right now to sustain its existence, and how it is a part of God's labor of love for you."
    },
    {
        week: 40,
        title: "The Fourth Point: My Response",
        lesson: {
            title: "Take, Lord, Receive",
            content: "Having reflected on God's overwhelming generosity, our only authentic response is to offer everything back to Him in love. We pray the 'Suscipe' prayer of St. Ignatius: 'Take, Lord, and receive all my liberty, my memory, my understanding, and my entire will... Give me only your love and your grace, that is enough for me.' This is the culmination of the journey: a life of freedom, gratitude, and loving service."
        },
        scripture: SCRIPTURE_PASSAGES.ROMANS_12,
        examenFocus: "As you end this journey, what is one thing in your life (your liberty, memory, understanding, or will) that you feel most called to offer back to God in gratitude? Make that your prayer today."
    }
];