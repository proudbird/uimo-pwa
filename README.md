To start app run commmand `npm run dev` and then follow the link shown.

CSS library to use [Adobe Spectrum CSS](https://opensource.adobe.com/spectrum-css/index.html)

To add new component (ex.: Switch):
1. Add folder `switch` to `platform/ui/components/basic`
2. Add folowing 4 files:
   - `switch.desc.ts` - specification of the component, describes its properties
   - `switch.ts` - component module to declare component class and its logic
   - `switch.scss` - styling component
   - `index.ts` - just a component index file, also imports component style
3. Register component in `platform/ui/components/index.ts` file

To use that componen:
`
...
tagName: "@switch",
...
`
