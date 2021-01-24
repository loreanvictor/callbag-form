// istanbul ignore file
// TODO: this should be a typing PR to https://github.com/Andarist/callbag-remember instead.

import { DATA, END, Source, START } from 'callbag-common';

const noop = () => {};
const UNIQUE = {};

export function remember<T>(source: Source<T>): Source<T> {
  const sinks: any[] = [];
  let inited = false;
  let endValue: T | typeof UNIQUE = UNIQUE;
  let sourceTalkback: any;
  let value: T | undefined | typeof UNIQUE;

  return (start: START | DATA | END, sink: any) => {
    if (start !== 0) {
      return;
    }

    if (endValue !== UNIQUE) {
      sink(0, noop);
      if (inited) {
        sink(1, value);
      }
      sink(2, endValue);

      return;
    }

    sinks.push(sink);

    const talkback = (type: START | DATA | END, data: any) => {
      if (type === 2) {
        const index = sinks.indexOf(sink);

        if (index !== -1) {
          sinks.splice(index, 1);
        }

        return;
      }

      if (endValue !== UNIQUE) {
        return;
      }

      sourceTalkback(type, data);
    };

    if (sinks.length === 1) {
      source(0, (type: START | DATA | END, data: any) => {
        if (type === 0) {
          sourceTalkback = data;
          sink(0, talkback);

          return;
        }

        if (type === 1) {
          inited = true;
          value = data;
        }

        const sinksCopy = sinks.slice(0);

        if (type === 2) {
          endValue = data;
          sinks.length = 0;
        }

        sinksCopy.forEach(_sink => {
          _sink(type, data);
        });
      });

      return;
    }

    sink(0, talkback);

    if (inited && endValue === UNIQUE) {
      sink(1, value);
    }
  };
}
