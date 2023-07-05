export default function injectGlobals(source: string, triggers: string[]): string {
  // Create the pattern with the injected triggers
  const pattern = new RegExp(
    `((\\w+|\\w+\\n+\\s*|\\s+)\\.)?(${triggers.join('|')})((\\.\\w+|\\n+|\\s+|\\(\\.+\\)))+`,
    'gm'
  );

  let convertedCode = source;

  convertedCode = convertedCode.replace(pattern, (match, prefix, key, trigger, suffix) => {
    let result = key ? `Cubes("${key || ''}").` : '';

    for (let trig of triggers) {
      const pattern2 = new RegExp(`${trig}`);
      let matches = pattern2.exec(match)!;
      console.log(matches.input.split(`${trig}.`)[1])
      const base = matches.input.split(`${trig}.`)[1];
      result += `${trig}("${base.replace(suffix, '')}")`;
    }

    result += suffix;
    return result;
  });

  return convertedCode;
}
