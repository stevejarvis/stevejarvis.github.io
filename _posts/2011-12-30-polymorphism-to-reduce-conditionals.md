---
layout: post
title: Polymorphism to Reduce Conditionals
author: steve_jarvis
excerpt: "Conditional branching isn't fun for anybody, use polymorphism to avoid it."
tags: [object-oriented, polymorphism, code]
comments: true
---

Polymorphism in object oriented language is the practice of subclassing objects to add or modify functionality. With it, programmers can create smarter objects.

Having smarter, more efficient objects can reduce or eliminate the need for conditional statements. This is awesome because the work moves from runtime to compile time – programs execute faster. (It is just as beneficial for interpreted languages, compile time in this sense means it becomes built into the classes’ structure.)

To practice this myself (and learn some Python) I wrote this linked list. With one subclass – the EmptyNode class – of the standard node object I was able to be rid of all conditionals.

Think of the difference. In this example specifically, to add a node sans the EmptyNode class would require a check in the add method to test if this node is the last node.

{% highlight python %}
def add(self, value):
    if self.next != None:
        self.next.add(self, value)
    else:
        self.next = Node(value)
{% endhighlight %}

In a list of 1000 items, that’s 1000 conditionals that need to execute for EVERY node addition; it would add up.

Another neat side effect is the tidy, brief, and direct nature of the code. Notice that no method is longer than 2 lines. That’s cool. (Edit: The singleton implementation for EmptyNode is 5 lines.)

Anyway, check it.

{% highlight python %}
#!/usr/bin/python

# A basic linked list. No conditionals. Singleton EmptyNode.

import readline
import sys

class List(object):
    def __init__(self):
        self.head = EmptyNode()

    def add(self, value):
        self.head.add(self, value)

    def prnt(self, ignore):
        self.head.prnt()

    def setNext(self, node):
        self.head = node

    def clear(self, ignore):
        self.head.delete()

class Node(object):
    def __init__(self, value, emptyNode):
        self.value = value
        self.next = emptyNode

    def add(self, you, value):
        self.next.add(self, value)

    def prnt(self):
        print self.value
        self.next.prnt()

    def setNext(self, node):
        self.next = node

    # Once there are no pointers to the nodes they will be
    # garbage collected
    def delete(self):
        self.next.delete()

# The EmptyNode is always the last one of the mList.
# Knows how to do things that would otherwise require conditionals
# with only a standard Node class. Also is singleton.
class EmptyNode(Node):
    def __new__(cls):
        try:
            return cls._instance
        except:
            cls._instance = super(EmptyNode, cls).__new__(cls)
            return cls._instance

    def __init__(self):
        self.value = None
        self.next = None

    def add(self, you, value):
        you.setNext(Node(value, self))

    def prnt(self):
        print "EOL" # "End of List"

    def delete(self):
        mList.setNext(self)

    def help(ignore):
        print "add value - add the value to the mList."
        print "print - print the contents of the mList."
        print "clear - clear mList's contents."
        print "bye - leave the app."

    def leave(ignore):
        print "See ya!"
        sys.exit(0)


readline.get_line_buffer()
mList = List()
interfaces = {
    'print':mList.prnt,
    'add':mList.add,
    'bye':leave,
    'help':help,
    'clear':mList.clear
}

while(True):
    cmd = raw_input("do: ")
    command = cmd.split(None, 1)
    # Append else command[1] will be out of bounds.
    command.append('')
    try:
        interfaces[command[0]](command[1])
    except KeyError as e:
        print "Bad command. Try \"help\"."
{% endhighlight %}
