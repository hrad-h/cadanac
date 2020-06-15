import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;
import java.nio.channels.ServerSocketChannel;
import java.util.Iterator;

public class Client extends Thread implements Iface {
    public void connect(String host, int port) throws IOException {
        InetSocketAddress address = new InetSocketAddress(host, port);

        channel = SocketChannel.open(address);
        channel.configureBlocking(false);
        selector = Selector.open();

        channel.register(selector, SelectionKey.OP_READ);
    }

    @Override
    public void run() {
        Iterator<SelectionKey> it;
        while (channel.isConnected()) {
            try {
                if (selector.select() != 0) {
                    it = selector.selectedKeys().iterator();

                    while (it.hasNext()) {
                        SelectionKey key = it.next();

                        handleKey(key);

                        it.remove();
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void handleKey(SelectionKey key) throws IOException {
        if (key.isReadable()) {
            ByteBuffer buffer = ByteBuffer.allocate(80);
            buffer.clear();
            channel.read(buffer);
            if (buffer.get(0) == 0) {
                return;
            }

            System.out.printf("Buddy " + channel.getRemoteAddress() + " says: %s", new String(buffer.array()));
        }
    }

    @Override
    public void write(String input) throws IOException {
        channel.write(ByteBuffer.wrap(input.getBytes()));
        System.out.println("I say: " + input);
    }

    SocketChannel channel;
    Selector selector;
}
