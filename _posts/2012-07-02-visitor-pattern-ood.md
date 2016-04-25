---
layout: single
title: Visitor Pattern OOD
author: steve_jarvis
excerpt: "Examining the strengths of the visitor patter and it's appropriate usage."
tags: [java, object-oriented, design, software]
comments: true
header:
  image: header.jpg
---

Because object-oriented design is awesome and there’s much to learn, here's a look at the implementation and advantages of the visitor pattern. The visitor pattern is used to easily add functionality to classes without needing to mess with the base classes themselves. There’s a nice clean layer of separation between the core classes and the logic.

The examples we’ll use are a couple animal objects – a dog and a gecko. For this demo these animals only do two things:

* Return a value for how cool they are.
* Return a value for how useful they are in battle.

Here’s that program with polymorphism through inheritance. It’s as simple as you would expect, nothing real exciting.

{% highlight java %}
import java.io.*;

public class Main_std {
    public static void main(String[] args) {
        new Main_std().init();
    }

    private void init() {
        Animal[] animals = new Animal[2];
        animals[0] = new Dog();
        animals[1] = new Gecko();
        System.out.println("Animals combined battle worth: " + getBattleWorth(animals));
        System.out.println("Animals total coolness: " + getAnimalCoolness(animals));
    }

    public int getBattleWorth(Animal[] animals) {
        int total = 0;
        for(Animal a : animals) {
            total += a.getBattlePoints();
        }
        return total;
    }

    public int getAnimalCoolness(Animal[] animals) {
        int total = 0;
        for(Animal a : animals) {
            total += a.calcCoolness();
        }
        return total;
    }

    abstract class Animal implements AnimalStuff {
    }

    class Gecko extends Animal {
        public int getBattlePoints() {
            return 2;
        }

        public int calcCoolness() {
            return 7;
        }
    }

    class Dog extends Animal {
        public int getBattlePoints() {
            return 8;
        }

        public int calcCoolness() {
            return 5;
        }
    }

    interface AnimalStuff {
        int getBattlePoints();
        int calcCoolness();
    }
}
{% endhighlight %}

So why improve upon that? It’s a clean, concise example that does the job well. Consider, though, if these animal’s characteristics and actions were liable to change. If we needed to give the animals the ability to speak (assuming the noise is unique) there would have to be a speak() method added in EVERY class of animal. Making edits in so many places is not only tedious, but editing an already solid core class comes with the unnecessary risk of breaking existing functionality.

The visitor pattern aims to fix these issues. It’s also a form of polymorphism that utilizes something called “double dispatching”. The double dispatch is a double message send between two classes – the visitor and the class being visited. These message sends allow all of the logic in the core classes to be factored out into a completely separate Visitor class. To add functionality to the objects we’d just create another Visitor class. It’s clean and safe. And here’s that program!

{% highlight java %}
import java.io.*;

public class Main_vis {
    public static void main(String[] args) {
        new Main_vis().init();
    }

    private void init() {
        Animal[] animals = new Animal[2];
        animals[0] = new Dog();
        animals[1] = new Gecko();
        System.out.println("Animals combined battle worth: " + getBattleWorth(animals));
        System.out.println("Animals total coolness: " + getAnimalCoolness(animals));
    }

    public int getAnimalCoolness(Animal[] animals) {
        CoolnessVisitor cVisitor = new CoolnessVisitor();
        for(Animal a : animals) {
            a.accept(cVisitor);
        }
        return cVisitor.getCoolness();
    }

    public int getBattleWorth(Animal[] animals) {
        BattleVisitor bVisitor = new BattleVisitor();
        for(Animal a : animals) {
            a.accept(bVisitor);
        }
        return bVisitor.getBattle();
    }

    abstract class Animal implements visitable {
    }

    class Gecko extends Animal implements visitable {
        public void accept(Visitor visitor) {
            visitor.visit(this);
        }
    }

    class Dog extends Animal implements visitable {
        public void accept(Visitor visitor) {
            visitor.visit(this);
        }
    }

    class CoolnessVisitor implements Visitor {
        private int coolnessTotal;

        public int getCoolness() {
            return coolnessTotal;
        }

        public void visit(Dog dog) {
            coolnessTotal += 5;
        }

        public void visit(Gecko gecko) {
            coolnessTotal += 7;
        }
    }

    class BattleVisitor implements Visitor {
        private int battleTotal;

        public int getBattle() {
            return battleTotal;
        }

        public void visit(Dog dog) {
            battleTotal += 8;
        }

        public void visit(Gecko gecko) {
            battleTotal += 2;
        }
    }

    interface Visitor {
        void visit(Dog dog);
        void visit(Gecko gecko);
    }

    interface visitable {
        void accept(Visitor visitor);
    }
}
{% endhighlight %}

So at first it might look a bit unappetizing – there are more lines of code and more classes; it feels overly complicated. The cool part comes in when we want to add functionality to the animal classes. Using inheritance alone required us to edit each animal class, but using the visitor pattern allows us to just add a separate single class. There is no risk of us breaking any of the existing code, we don’t even touch it.

{% highlight java %}
class SpeakVisitor implements Visitor {
    public int visit(Gecko gecko) {
        System.out.println("");
    }

    public void visit(Dog dog) {
        System.out.println("Woof");
    }
}
{% endhighlight %}

And now our animals speak!

It’s important to understand that the visitor pattern isn’t all golden though. Like everything else, it’s just another tool and has a time and place. In this example we assume a static set of core classes and changing functionality. If we flipped the environment and were dealing with an ever-changing set of objects with mostly consistent methods the visitor pattern becomes the opposite of what we want.
