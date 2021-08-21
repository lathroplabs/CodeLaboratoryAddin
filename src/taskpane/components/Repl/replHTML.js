export function generateReplHTML(input_data) {
  return `
  <!doctype html>
<html>
  <head>
  <meta charset="UTF-8">
  <script src="https://cdn.jsdelivr.net/npm/jquery"></script>
  <script src="https://cdn.jsdelivr.net/npm/jquery.terminal@2.23.0/js/jquery.terminal.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/jquery.terminal@2.23.0/css/jquery.terminal.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/pyodide/dev/full/pyodide.js"></script>
  <style>
    .terminal {
      --size: 1.5;
      --color: rgba(255, 255, 255, 0.8);
    }
  </style>
</head>
<body class="full-screen-terminal">
  <script>
    "use strict";
    function sleep(s) {
      return new Promise((resolve) => setTimeout(resolve, s));
    }

    async function main() {
      globalThis.pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/dev/full/",
      });
      let namespace = pyodide.globals.get("dict")();
      pyodide.runPython(
        '
          import sys
          from pyodide import to_js
          from pyodide.console import PyodideConsole, repr_shorten, BANNER
          import __main__
          BANNER = "Welcome to the Pyodide terminal emulator 🐍\\n" + BANNER
          pyconsole = PyodideConsole(__main__.__dict__)
          async def await_fut(fut):
            return to_js([await fut], depth=1)
          def clear_console():
            pyconsole.buffer = []
      ',
        namespace
      );
      let repr_shorten = namespace.get("repr_shorten");
      let banner = namespace.get("BANNER");
      let await_fut = namespace.get("await_fut");
      let pyconsole = namespace.get("pyconsole");
      let clear_console = namespace.get("clear_console");
      namespace.destroy();

      let ps1 = ">>> ",
        ps2 = "... ";

      async function lock() {
        let resolve;
        let ready = term.ready;
        term.ready = new Promise((res) => (resolve = res));
        await ready;
        return resolve;
      }

      async function interpreter(command) {
        let unlock = await lock();
        term.pause();
        // multiline should be splitted (useful when pasting)
        for (const c of command.split("\n")) {
          let fut = pyconsole.push(c);
          term.set_prompt(fut.syntax_check === "incomplete" ? ps2 : ps1);
          switch (fut.syntax_check) {
            case "syntax-error":
              term.error(fut.formatted_error.trimEnd());
              continue;
            case "incomplete":
              continue;
            case "complete":
              break;
            default:
              throw new Error(Unexpected type);
          }

          // In Javascript, await automatically also awaits any results of
          // awaits, so if an async function returns a future, it will await
          // the inner future too. This is not what we want so we
          // temporarily put it into a list to protect it.
          let wrapped = await_fut(fut);
          // complete case, get result / error and print it.
          try {
            let [value] = await wrapped;
            if (value !== undefined) {
              term.echo(
                repr_shorten.callKwargs(value, {
                  separator: "\\n[[;orange;]<long output truncated>]\\n",
                })
              );
            }
            if (pyodide.isPyProxy(value)) {
              value.destroy();
            }
          } catch (e) {
            if (e.constructor.name === "PythonError") {
              term.error(fut.formatted_error.trimEnd());
            } else {
              throw e;
            }
          } finally {
            fut.destroy();
            wrapped.destroy();
          }
        }
        term.resume();
        await sleep(10);
        unlock();
      }

      let term = $("body").terminal(interpreter, {
        greetings: banner,
        prompt: ps1,
        completionEscape: false,
        completion: function (command, callback) {
          callback(pyconsole.complete(command).toJs()[0]);
        },
        keymap: {
          "CTRL+C": async function (event, original) {
            clear_console();
            term.echo_command();
            term.echo("KeyboardInterrupt");
            term.set_command("");
            term.set_prompt(ps1);
          },
        },
      });
      window.term = term;
      pyconsole.stdout_callback = (s) => term.echo(s, { newline: false });
      pyconsole.stderr_callback = (s) => {
        term.error(s.trimEnd());
      };
      term.ready = Promise.resolve();
      pyodide._module.on_fatal = async (e) => {
        term.error(
          "Pyodide has suffered a fatal error. Please report this to the Pyodide maintainers."
        );
        term.error("The cause of the fatal error was:");
        term.error(e);
        term.error("Look in the browser console for more details.");
        await term.ready;
        term.pause();
        await sleep(15);
        term.pause();
      };
    }
    window.console_ready =  main();
    window.input_data = ${input_data}
    
  </script>


<div class="terminal" style="--char-width: 10.8125; --terminal-height: 365; --terminal-x: 10; --terminal-y: 80; --terminal-scroll: 0;">
  <div class="terminal-wrapper">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14" style="display: none;">
      <title id="title2">rounded</title>
      <path id="terminal-broken-image" d="m 14,10 h 2 v 1 a 3,3 0 0 1 -3,3 H 3 A 3,3 0 0 1 0,11 H 4.5 A 1.00012,1.00012 0 0 0 5.207,10.707 L 6.5,9.414 7.793,10.707 a 0.99963,0.99963 0 0 0 1.41406,0 l 2.36719,-2.36719 1.80127,1.44092 A 0.99807,0.99807 0 0 0 14,10 Z M 16,3 V 8 H 14.35059 L 12.12451,6.21924 A 0.99846,0.99846 0 0 0 10.793,6.293 L 8.5,8.586 7.207,7.293 a 0.99962,0.99962 0 0 0 -1.41406,0 L 4.08594,9 H 0 V 3 A 3,3 0 0 1 3,0 h 10 a 3,3 0 0 1 3,3 z M 6,4.5 A 1.5,1.5 0 1 0 4.5,6 1.5,1.5 0 0 0 6,4.5 Z"></path>
    </svg>
    <div class="terminal-output" role="log">
      <div data-index="0">
        <div style="width: 100%;">
          <span data-text="Welcome&nbsp;to&nbsp;the&nbsp;Pyodide&nbsp;terminal&nbsp;emulator&nbsp;🐍">Welcome&nbsp;to&nbsp;the&nbsp;Pyodide&nbsp;terminal&nbsp;emulator&nbsp;🐍</span>
        </div>
        <div style="width: 100%;"><span data-text="Python&nbsp;3.9.5&nbsp;(default,&nbsp;Aug&nbsp;14&nbsp;2021&nbsp;20:11:33)&nbsp;on&nbsp;WebAssembly&nbsp;VM">Python&nbsp;3.9.5&nbsp;(default,&nbsp;Aug&nbsp;14&nbsp;2021&nbsp;20:11:33)&nbsp;on&nbsp;WebAssembly&nbsp;VM</span></div><div class="cmd-end-line" style="width: 100%;"><span data-text="Type&nbsp;" help",&nbsp;"copyright",&nbsp;"credits"&nbsp;or&nbsp;"license"&nbsp;for&nbsp;more&nbsp;information."="">Type&nbsp;"help",&nbsp;"copyright",&nbsp;"credits"&nbsp;or&nbsp;"license"&nbsp;for&nbsp;more&nbsp;information.</span></div></div></div><div class="cmd" style="width: 100%; top: 0px;"><div class="cmd-wrapper" style=""><span class="cmd-prompt" style="margin-left: 0px; visibility: visible;"><span data-text=">>>&nbsp;"><span style="width: 4ch;">&gt;&gt;&gt;&nbsp;</span></span></span><div class="cmd-cursor-line" role="presentation" aria-hidden="true"><span></span><span class="cmd-cursor" style=""><span data-text="" class="end"><span>&nbsp;<span></span></span></span></span><span></span></div></div><textarea autocapitalize="off" spellcheck="false" tabindex="1" class="cmd-clipboard" data-cmd-prompt=">>>&nbsp;" style="top: 0px;"></textarea></div></div><div class="terminal-font">&nbsp;</div><div class="terminal-fill"></div><div class="terminal-scroll-marker"><div style="height: 20px;"></div></div></div></body></html>
  `
  return 
}