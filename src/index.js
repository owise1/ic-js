const IPFS = require('ipfs')
// const IpfsClient = require('ipfs-http-client')
const IC = require('./ic')

async function main () {
// Create the first peer
  const ipfs1_config = { repo: './ipfs1' }
  const ipfs1 = await IPFS.create(ipfs1_config)
  // Create the second peer
  const ipfs2_config = { 
    repo: './ipfs2',
    config: {
      Addresses: {
        Swarm: [
          '/ip4/0.0.0.0/tcp/4012',
          '/ip4/127.0.0.1/tcp/4013/ws'
        ],
        API: '/ip4/127.0.0.1/tcp/5012',
        Gateway: '/ip4/127.0.0.1/tcp/9191'
      }
    }
 }
  const ipfs2 = await IPFS.create(ipfs2_config)

  const ic = await IC.create({
    ipfs: ipfs1
  })
  console.log(ic);
  const db1 = ic.db()

  const ic2 = await IC.create({
    ipfs: ipfs2,
    orbitdb: {
      directory: './orbitdb2',
      db: ic.db().address.toString()
    }
  })

  const db2 = ic2.db()

  // When the second database replicated new heads, query the database
  db2.events.on('replicated', () => {
    const result = db2.iterator({ limit: -1 }).collect().map(e => e.payload.value.time)
    console.log(result.join('\n'))
    console.log('---');

  })

  // Start adding entries to the first database
  setInterval(async () => {
    await db1.add({ time: new Date().getTime() })
  }, 1000)
}

main()
