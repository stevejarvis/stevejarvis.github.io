---
layout: single
title: "Cryptocurrencies, Part 1 - How Digital Currencies Work"
author: steve_jarvis
excerpt: "Learning how the cryptocurrency systems work, generally."
tags: [litecoin, ubuntu, crypto, currency, currencies, mining]
comments: true
---

In 2009, there was a new currency (Bitcoin) invented. In recent years many
variations have sprouted up, often called "altcoins".[^2] They all operate
similarly at a technical level.

### Wallets
Crypto wallets serve as your cryptocurrency identity, which is the private half
of a public key pair. Other users send you money by sending coins to your public
key, and you do the same to theirs. There isn't an amount of money directly tied
to this identity, but rather the sum of a long history of transactions.

The private keys are also used by the sender to sign transactions, to prove the
transaction is authentic. Therefore, as usual, the entire system hinges on the
users' ability to keep private keys private--if a key is leaked all the
money disappears as quickly as the next person can type. It's also the only thing tying a user
to his or her wallet, and if it's lost so is the ability to spend the value of
the wallet (by anyone, those coins are gone forever).

### Transactions
Every movement of coins is recorded as a transaction. A transaction is simply a
record of some coins moving from one public address to another. These
transactions are stored in blocks, and linked to one another in a sequential
chain. As mentioned, this chain of transactions is precisely how the value of
your wallet is determined.

Every user of the currency has his or her own complete copy of this transaction
history, called the block chain, since the beginning of time. It's a record
of every transaction that ever happened. These block chains are asynchronously
passed around and actively used by all users around the world. So, who's to say
my chain is more correct than your chain? After all, the
value of a user's wallet is determined simply by the sum of all transactions, so
if I were to forge a block chain with an arbitrary number of transactions into
my account I'd be a millionaire in no time.

This is a real concern, but building the block chain involves brute
forcing hashes. The first solution to the presented problem adds that block to
the chain, so making a transaction official is effectively a race among everyone
in the world. No single entity has the processing power to consistently beat the
rest of the network, so, theoretically, forging the transaction record is just
not possible (in reality, pools of many users often form to solve blocks
  cooperatively, and some do arguably amass the power to cast doubt on the
  sanctity of this process[^3]).

Because this entire process happens asynchronously, it's completely possible
that two different blocks are solved at the same time by different parties and
cause the chain to diverge. When this happens, the chain used by the network
is simply the longest one. Because these problems are so difficult, it's
very unlikely that two divergent transaction records stay in step for long,
and as soon as one surpasses the other it becomes the accepted chain.
This happens fairly quickly, as the first block that isn't solved in a "tie"
will determine the accepted chain (however, there have been times when a fork
went unnoticed for longer than it should have[^4]). The transactions in the
chain not chosen are effectively thrown out; they never happened.

### Solving Blocks
This is where the real cryptocurrency excitement comes in. Every block
needs to be finalized to be accepted into the block chain. A block is finalized
when a nonce is discovered that causes that transaction to hash to a
particular range of values. For example, if an unconfirmed block is
represented by $$01234ABCD$$, and the accepted range of hashes is
$$[0,1000000]$$, then the value that confirms the block is any
value $$n$$ such that $$0 < PRF( n, 01234ABCD ) < 1000000$$. The value of
1000000 is chosen just for simplicity, in practice the Bitcoin family uses
SHA256, so the range is actually enormous: $$[0,2^{256})$$.

Since these are meant to be real, usable currencies, and a transaction isn't
accepted until one of these outrageously difficult math problems is solved,
it's desirable that there's some predictability regarding the length of time
required to process a transaction. If I were a merchant and it took an
arbitrarily long time to get paid, I wouldn't be very interested in accepting
these cryptocurrencies.

To keep the time to process transactions consistent and
predictable, the block solution process implements a mutable level of
difficulty. The difficulty effectively limits the field of acceptable
answers. If the difficulty is 1, and the field again is $$[0,1000000]$$, then
the acceptable range is $$1000000/1 = [0,1000000]$$. Any value in that range is
acceptable to finalize the block. To make it more difficult and slow the rate at
which blocks are solved, the difficulty is increased. With a difficulty of 4 the
range of acceptable answers becomes $$1000000/4 = [0,250000]$$, and it will
take the community 4 times longer to find a solution on average.

This process of solving blocks to finalize transactions is what's referred to as
"mining". Currencies pay rewards for solutions, and so it's lucrative to find
these magic values. That's why there's a lot of buzz about building mining
rigs to brute force the hash space as rapidly as possible.

The end result is a currency that pays its users to maintain the transaction
record and determine the value of every wallet in the mix, and the process is
proven authentic by its very nature (it's too computationally difficult to
forge). It's really a brilliant solution.

### Actually Mining
I found this all pretty fascinating on this slow weekend, and even
started mining on a spare laptop myself to see what it's like. More about that
in Part 2...


[^1]: CNN Money. Someone bought a $100,000 Tesla with Bitcoins. http://money.cnn.com/2013/12/06/autos/tesla-bitcoin/
[^2]: Wikipedia. Cryptocurrency. https://en.wikipedia.org/wiki/Cryptocurrency
[^3]: Reddit. PSA : GHASH just mined the last 6 consecutive blocks and 42% of blocks in the past 24 hours. https://www.reddit.com/r/Bitcoin/comments/276swq/psa_ghash_just_mined_the_last_6_consecutive/
[^4]: Bitcoin Magazine. Bitcoin Network Shaken by Blockchain Fork. https://bitcoinmagazine.com/3668/bitcoin-network-shaken-by-blockchain-fork/
