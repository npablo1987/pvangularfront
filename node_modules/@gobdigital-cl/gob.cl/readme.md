# gob.cl framework

Set of tools for the design and layout of government web sites and applications.
Contains form templates, buttons, boxes, navigation menus and other design elements.
Based on Twitter Bootstrap.

## Content
* [Installation.](#installation)
* [Development.](#development)

## Installation.

For install run: 

`npm install @gobdigital-cl/gob.cl`

## Development.

### Commands: 

+ `npm run build` for build gob.cl library
+ `npm run watch` for build gob.cl library and watch files for re-build
+ `npm run serve` for run site demo w/ browserSync
+ `npm run clean` for clean build files.

### Best practicies

To maintain good code quality, you must maintan the standard.
Here is a list of the main issues to be concerned when creating
a new component:

- Respect the framework design: Avoid using custom colors, custom fonts, 
disproportionate numbers, etc. Always use the tools provided that conform to
the design.
- Be aware of the different screen sizes: Your new component should look good
on a desktop, tablet and mobile screen. Note that each of one could
have a different resolution so you always test your new feature 
before publish your changes.
- Keep in mind the accessibility of your site: Not all users can access
web content in the same way, therefore, to make your site accessible, you 
should always create a version of your new component for when the font size is
increased and for contrast mode.
- English is the standard: Class names, code comments, file name, this readme,
all of the content in the framework must keep English as the language
used. Don't worry if it isn't perfect, you can always use tools like google
translate.
- Take care of the CASE: The way the different objects are written helps
developer to easily identify what they are looking at. The classes are written
in kebab-case, attributes are in lower case, html identifiers are in camelCase,
etc.

### Git flow

For development, you can use any Git Flow that meets your needs.

### Npm update

When you are ready with a new version to be published, you must update
the npm package (only users with access to the package repository can update the 
npm package). To do this, follow the steps bellow:
- Prepare the relase:
    + `npm run build`
- (Optional) Update the changelog file.
- Update the version number:
    + `npm version <update_type>`
- Publish to npm
    + `npm publish --access public`