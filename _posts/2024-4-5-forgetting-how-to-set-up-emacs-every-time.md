---
layout: single
title: Forgetting how to set up Emacs every time I get a new computer
author: steve_jarvis
excerpt: Was it emacs-plus or emacs-mac that had a weird window thing? How did Go imports get re-written on save?
tags: [emacs, doom, doom emacs, setup, notes]
comments: true
toc: false
---

Here we're rocking [Doom](https://github.com/doomemacs/doomemacs/tree/master). This is not exactly complex but 
it's enough that I have to relearn it every time I have to install it again, so actually writing it
down this time. These are self notes, if they help someone else that's cool too though.

## Emacs itself
[Doom recommends emacs-mac](https://github.com/doomemacs/doomemacs/blob/master/docs/getting_started.org#on-macos) and 
that's what I went with. I was also using `emacs-plus` for a bit but I could not get the window to take
focus like it should. I actually still have that issue w/ `emacs-mac` too and I have no idea why it happens, but
it's less often. Like if emacs is launched as the `$EDITOR` for a git commit, I cannot type in the GUI, all keystrokes
to go the Terminal. If this rings a bell with anyone let me know :bow:.

Brew install [emacsmacport](https://github.com/railwaycat/homebrew-emacsmacport).

```shell
brew tap railwaycat/emacsmacport
brew install emacs-mac --with-modules
ln -s /usr/local/opt/emacs-mac/Emacs.app /Applications/Emacs.app
```

## Then install Doom
[Install Doom](https://github.com/doomemacs/doomemacs/blob/master/docs/getting_started.org#doom-emacs) and
symlink the Doom files from [rcs](https://github.com/stevejarvis/rcs).

```shell
git clone https://github.com/hlissner/doom-emacs ~/.emacs.d
~/.emacs.d/bin/doom install
```

```shell
ln -s ~/rcs/doom/init.el ~/.doom.d/init.el
ln -s ~/rcs/doom/config.el ~/.doom.d/config.el
ln -s ~/rcs/doom/packages.el ~/.doom.d/packages.el
```

```shell
doom sync
doom install
doom doctor
```

### Configure 
I basically can't type if Caps Lock isn't mapped to Control and `kj` escapes insert mode. This 
should also be tracked in the `doom/config.el` rcs on GitHub, but just in case I need another 
reference, here is:

```lisp
(after! evil
  (setq evil-escape-key-sequence "kj"))

(setq doom-font (font-spec :family "Monaco" :size 14))

(use-package! protobuf-mode)

(after! go-mode
  (setq gofmt-command "goimports")
  (add-hook 'go-mode-hook
            (lambda ()
              (add-hook 'before-save-hook 'gofmt nil 'make-it-local))))
```

## Gopls (or <insert language server>)
Repeat for other language dependencies, but focused on [Go](https://emacs-lsp.github.io/lsp-mode/page/lsp-gopls/) 
at the moment.

```shell
brew install gopls
go install golang.org/x/tools/cmd/goimports@latest
```

## Linking the app
For the CLI, the `--with-starter` option on install should take care of it, but if not double-check
[this doc here](https://github.com/railwaycat/homebrew-emacsmacport/blob/master/docs/emacs-start-helpers.md#starter-script-1).
It should take over system emacs in priority, too.

For the GUI, just link in `/Applications`.
```shell
ln -s $(brew --prefix)/opt/emacs-mac/Emacs.app /Applications/Emacs.app
```

