import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.*; 


public class App {

static String[] freewill = {
"There are those who think that life\n",
"Has nothing left to chance\n",
"A host of holy horrors\n",
"To direct our aimless dance\n",
"A planet of playthings\n",
"We dance on the strings\n",
"Of powers we cannot perceive\n",
"The stars aren't aligned\n",
"Or the gods are malign\n",
"Blame is better to give than receive\n",
"You can choose a ready guide\n",
"In some celestial voice\n",
"If you choose not to decide\n",
"You still have made a choice\n",
"You can choose from phantom fears\n",
"And kindness that can kill\n",
"I will choose a path that's clear\n",
"I will choose free will\n",
"There are those who think that\n",
"They've been dealt a losing hand\n",
"The cards were stacked against them\n",
"They weren't born in Lotus-Land\n",
"All preordained\n",
"A prisoner in chains\n",
"A victim of venomous fate\n",
"Kicked in the face\n",
"You can't pray for a place\n",
"In heaven's unearthly estate\n",
"You can choose a ready guide\n",
"In some celestial voice\n",
"If you choose not to decide\n",
"You still have made a choice\n",
"You can choose from phantom fears\n",
"And kindness that can kill\n",
"I will choose a path that's clear\n",
"I will choose free will\n",
"Each of us\n",
"A cell of awareness\n",
"Imperfect and incomplete\n",
"Genetic blends\n",
"With uncertain ends\n",
"On a fortune hunt\n",
"That's far too fleet\n",
"You can choose a ready guide\n",
"In some celestial voice\n",
"If you choose not to decide\n",
"You still have made a choice\n",
"You can choose from phantom fears\n",
"And kindness that can kill\n",
"I will choose a path that's clear\n",
"I will choose free will"
};
static String[] fear = {
"We've got nothing to fear but fear itself\n",
"Not pain, not failure, not fatal tragedy?\n",
"Not the faulty units in this mad machinery?\n",
"Not the broken contacts in emotional chemistry?\n",
"With an iron fist in a velvet glove\n",
"We are sheltered under the gun\n",
"In the glory game on the power train\n",
"Thy kingdom's will be done\n",
"And the things that we fear are a weapon to be held against us\n",
"He's not afraid of your judgment\n",
"He knows of horrors worse than your Hell\n",
"He's a little bit afraid of dying\n",
"But he's a lot more afraid of your lying\n",
"And the things that he fears are a weapon to be held against him\n",
"Can any part of life be larger than life?\n",
"Even love must be limited by time\n",
"And those who push us down that they might climb\n",
"Is any killer worth more than his crime?\n",
"Like a steely blade in a silken sheath\n",
"We don't see what they're made of\n",
"They shout about love, but when push comes to shove\n",
"They live for the things they're afraid of\n",
"And the knowledge that they fear is a weapon to be used against them\n",
"He's not afraid of your judgment\n",
"He knows of horrors worse than your hell\n",
"He's a little bit afraid of dyin'\n",
"But he's a lot more afraid of your lyin'\n",
"And the things that he fears\n",
"Are a weapon to be held against him\n",
"He's not afraid of your judgment\n",
"He knows of horrors, worse than your hell\n",
"He's a little bit afraid of dyin'\n",
"But he's a lot more afraid of your lyin'"
};
static String[] tom = {
"A modern-day warrior\n",
"Mean, mean stride\n",
"Today's Tom Sawyer\n",
"Mean, mean pride\n",
"Though his mind is not for rent\n",
"Don't put him down as arrogant\n",
"His reserve, a quiet defense\n",
"Riding out the day's events\n",
"The river\n",
"What you say about his company\n",
"Is what you say about society\n",
"Catch the mist\n",
"Catch the myth\n",
"Catch the mystery\n",
"Catch the drift\n",
"The world is, the world is\n",
"Love and life are deep\n",
"Maybe as his skies are wide\n",
"Today's Tom Sawyer, he gets high on you\n",
"And the space he invades, he gets by on you\n",
"No, his mind is not for rent\n",
"To any god or government\n",
"Always hopeful, yet discontent\n",
"He knows changes aren't permanent\n",
"But change is\n",
"And what you say about his company\n",
"Is what…"
};
static Map<String,String[]> songs;
static {
  songs = new HashMap<>();
  songs.put( "freewill", freewill );
  songs.put( "tom", tom );
  songs.put( "fear", fear );
}

    static Thread connect(String host, String port) throws InterruptedException, IOException {
            Client client;
            Server server;
            try {
              client = new Client();
              client.connect(host, Integer.parseInt(port));
              return( client );
            } catch( IOException e ) {
              server = new Server();
              server.listen(Integer.parseInt(port));
              return( server );
            }
    }

    public static void main(String[] args) throws InterruptedException, IOException {
        if (args.length != 3) return;

        Thread.sleep( 5000 );

        Thread worker;
        final Iface buddy;
        String[] sentences = songs.get(args[2]);
        System.out.println("Starting ..." + args[2]);

        worker = connect(args[0], args[1]);
        buddy = (Iface)worker;

        worker.start();
        service.execute(new Runnable() {
            @Override
            public void run() {
                System.out.println("Talking..");

                for ( String sentence: sentences) {
                    try {
                        buddy.write(sentence);
                        try {
                          Thread.sleep( 200 );
                        } catch( InterruptedException e) {
                          System.out.println("InterruptedException" );
                        }
                    } catch (IOException e) {
                        System.err.println("Could not write");
                    }
                }
            }
        });

        worker.join();
    }

    static ExecutorService service = Executors.newSingleThreadExecutor();
}
