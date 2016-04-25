---
layout: single
title: Le Shell (It's French)
author: steve_jarvis
excerpt: "A bash-like shell, implemented in Perl."
tags: [perl, shell, bash]
comments: true
---

A massive expansion on previous trials, this is an Perl implementation of an entire basic shell. <a href="https://github.com/stevejarvis/le_shell" target="_blank">It's also on Github.</a>

Brief overview of non-standard features:

- ‘!’ executes last command, ‘!#’ executes a specific command from history, specified by #.
- ‘* newprompt’ changes prompt to newprompt.
- ‘file filename.leshell’ executes the semicolon separated commands in the file.

There are two main issues and I’m offering an immediate 10 bonus points for an explanation!

- ‘bye’ doesn’t exit immediately if any error occurred.
- catching ^c (interupt) only works once.

{% highlight perl %}
#!/opt/local/bin/perl

# Brief overview of features:
# - '!' executes last command, '!#' executes a specific number command from history
# - '* prompt' changes prompt to prompt
# - 'file filename.leshell' executes the semicolon separated commands in the file

# KNOWN ISSUES:
# bye doesn't exit if any error occurred
# catching ^c only works once

use strict;
# use warnings;
use Term::ReadLine;
use Term::ReadLine::Gnu;
use Cwd;
use String::Similarity;
use POSIX;
use File::Glob;
use Env;# Makes environment vars work automagically

#$SIG{INT} = \&hiya;
#$SIG{CHLD} = "IGNORE";

my $debug = 0;
my $prompt = 'orig ';
my $term = new Term::ReadLine 'leShell';
my $pid;
$term->Attribs->ornaments( 0 );

sub generatePrompt {
    if( $prompt eq 'orig ' ) {
        return getlogin() . '@' . getcwd . '> ';
    } else {
        return $prompt;
    }
}

# Return an array of array refs. Each subarray will be a command separated on words and
# stripped of extra whitespace.
sub cmdToArrayOfArrays {
    my @cmd = split( /;/, shift );
    my @commands;

    foreach( @cmd ) {
        $_ =~ s/^\s*//;
        $_ =~ s/\s*$//;
        my @tempCmdSplitOnWhite = split( /\s+/, $_ );
        if( @tempCmdSplitOnWhite ) {
            push( @commands, \@tempCmdSplitOnWhite );
        }
    }

    return @commands;
}

# Passed a reference to an array of references to arrays. Trippy.
# Look for *'s in the commands that aren't changing prompt and substitute the appropriate expansion.
# Returns false if there was supposed to be an expansion and nothing was found.
sub expandGlob {
    my $bigRef = shift;

    foreach( @$bigRef ) {
        my $littleRef = $_;

        my $index = 0;
        foreach( @$littleRef ) {
            if( $_ =~ qr/\*/ and $index > 0 ) {
                my @blob = glob( $_ );
                unless( @blob ) {
                    print "Nothing found on expansion.\n";
                    return 0;
                }
                splice( @$littleRef, $index, 1, @blob );
                last;
            }
            $index ++;
        }
    }

    return 1;
}

# Pass app, returns directory/app_name on success. Prints failed otherwise.
sub searchPathForApp {
    my $token = shift;
    my @path = split( /:/, $ENV{'PATH'} );
    my $bestFit = 0;
    my $closestApp = "wtf", my $closestDir = "not/even/close";

    unless( @path ) {
        print "Broken path! Quitting.\n";
        exit 0;
    }

    foreach( @path ) {
        if( opendir( my $dir, $_ ) ) {
            my $currentDir = $_;
            while( readdir( $dir ) ) {
                if( $_ eq $token ) {
                    closedir( $dir );
                    return $currentDir . "/" . $_;
                } elsif( similarity( $_, $token ) > $bestFit ) {
                    $bestFit = similarity( $_, $token );
                    $closestApp = $_;
                    $closestDir = $currentDir;
                }
            }
            closedir( $dir );
        }
    }

    unless( $debug ) {
        print( "$token not found. Did you mean $closestApp at $closestDir/$closestApp?\n" );
    }
    return 0;
}

# Pass an array of the command. Comes out with app name as arg[1] and dir as arg[0]
sub makeBeginningOfArrayExecName {
    my $ref = shift;

    if( @$ref[0] !~ qr/\// ) { # Not a dir, find dir and put on @cmd
        my $dir = searchPathForApp( @$ref[0] );
        if( $dir ) {
            unshift( @$ref, $dir );
        }
    } else { # 0 is executable, parse for name and add at 1
        @$ref[0] =~ qr/\/?([[:alpha:]]*)$/;
        splice( @$ref, 1, 0, $1 );
    }
}

# Takes a reference to an array of a command.
sub frkExec {
    my $cmdRef = shift;
    my @cmd = @$cmdRef;

    $pid = fork();
    if( $pid ) {
        # Parent
        return waitpid( $pid, 0 );
    } elsif( $pid == 0 ) {
        # Child
        exec{ $cmd[0] } splice( @cmd, 1 ) or print STDERR "Couldn't execute " . $cmd[0] . " - " . $! . "\n";
    } else {
        die "Error forking.\n";
    }
}

sub runCommands {
    my $commandsRef = shift;

  COMMAND: foreach( @$commandsRef ) {
      # Here check for special chars separately. Prolly glob too.
      if( @$_ ~~ qr/^\$/ ) {
          subEnvVariable( \@$_ );
      }
      if( @$_ ~~ qr/.*~.*/ ) {
          subSquiggly( \@$_ );
      }
      if( @$_[0] eq 'bye' ) {
          byebye();
      } elsif( @$_[0] eq '*' ) {
          setPrompt( splice( @$_, 1 ) );
          next COMMAND;
      } elsif( @$_[0] =~ qw/!/ ) {
          next COMMAND unless substituteHistory( \@$_ );
          my @tempCmd = cmdToArrayOfArrays( "@$_" );
          runCommands( \@tempCmd );
          next COMMAND;
      } elsif( @$_[0] eq 'file' ) {
          runFile( @$_[1] );
          next COMMAND;
      } elsif( @$_[0] eq 'cd' ) {
          my @dir = splice( @$_, 1 );
          my $string = "@dir";
          $string =~ s/^\s*//;
          $string =~ s/\s*$//;
          if( $string eq "" ) { print "No dir?\n"; next COMMAND; }
          print "That's not a directory.\n" unless chdir( $string );
          next COMMAND;
      }

      makeBeginningOfArrayExecName( \@$_ );
      chomp( @$_ );

      frkExec( \@$_ );
  }
}

sub subSquiggly {
    my $cmdRef = shift;

    my $index = 0;
    foreach( @$cmdRef ) {
        @$cmdRef[$index] =~ s/~/$ENV{'HOME'}/g;
        $index++;
    }
}

sub subEnvVariable {
    my $cmdRef = shift;

    my $index = 0;
    foreach( @$cmdRef ) {
        if( $_ =~ qr/^\$([[:alpha:]]+)/ ) {
            @$cmdRef[$index] =~ s/\$(([A-Z]|_)+)/$ENV{$1}/g;
        }
        $index++;
    }
}

sub runFile {
    my $fileName = shift;

    $fileName =~ qr/\.([[:alpha:]]+)$/;
    if( $1 eq 'leshell' ) {
        my @command;
        my $file;
        if( !open( $file, "<", $fileName ) ) {
            print "Cannot open file.\n";
            return;
        }
        foreach( <$file> ) {
            push( @command, $_ );
        }
        @command = cmdToArrayOfArrays( "@command" );
        runCommands( \@command );
    } else {
        print "file command needs an argument file with '.leshell' extension.\n";
    }
}

sub byebye {
    print "See ya.\n";
  POSIX:_exit( 0 );
}

sub getPrompt {
    return $prompt;
}

sub setPrompt {
    $prompt = "@_" . " "; # Mandatory space..
}

sub substituteHistory {
    my $cmdRef = shift;

    $term->remove_history( $term->where_history );

    if( $term->where_history == 0 ) {
        print "No history.\n";
        return 0;
    }

    if( length( @$cmdRef[0] ) == 1 ) {
        return 0 unless getLastHistory( \@$cmdRef );
    } else {
        return 0 unless getSpecificHistory( \@$cmdRef );
    }

    return 1;
}

sub getLastHistory {
    my $cmdRef = shift;

    my @history = $term->GetHistory();
    my $size = @history;
    @$cmdRef = split( /\s/, $history[ $size - 1 ] );

    return "america";
}

sub getSpecificHistory {
    my $cmdRef = shift;

    my $requestNumber = substr( @$cmdRef[0], 1 );
    if( $requestNumber > $term->where_history() ) {
        print "Too big.\n";
        return 0;
    }
    @$cmdRef = split( /\s/, $term->history_get( $requestNumber ) );

    return "awesome";
}

sub hiya {
    print "Got to hiya\n";
    kill( 9, $pid );
    showPrompt();
}

sub showPrompt {
    if( !$debug ) {
      PROMPT: while( defined( $_ = $term->readline( generatePrompt() ) ) ) {
          my @commands = cmdToArrayOfArrays( $_ );

          next PROMPT unless expandGlob( \@commands );
          runCommands( \@commands );
      }
    }
}

showPrompt();

1
{% endhighlight %}