# editJson
Adapt Authoring Plugin to edit content as JSON

## Installation
1 Copy the `editJson` folder into `/frontend/src/plugins/` in your authoring tool folder.
2 Update require in `/frontend/src/core/app.js`

```JavaScript
function loadAddOns(callback) {
    // ['modules/modules','plugins/plugins']
    require([
      // modules
      'modules/actions/index',
      'modules/assetManagement/index',
      'modules/contentPane/index',
      'modules/contextMenu/index',
      'modules/editor/index',
      'modules/filters/index',
      'modules/globalMenu/index',
      'modules/help/index',
      'modules/location/index',
      'modules/modal/index',
      'modules/navigation/index',
      'modules/notify/index',
      'modules/options/index',
      'modules/pluginManagement/index',
      'modules/projects/index',
      'modules/scaffold/index',
      'modules/sidebar/index',
      'modules/user/index',
      'modules/userManagement/index',
      
      'plugins/editJson/index' // <-- require the plugin
    ], callback);
  }
```

## Usage
The Plugin adds an item to the Contextmenu of Pages, Submenus, Articles, Blocks and Components. Klicking this icon will open a JSON-Editor with the raw json data of the Element.    
**CAUTION: You will edit raw JSON data and therefore you can possible break things. Please only use this feature when you are familiar with JSON and know the Adapt Framework already!!!**

### Scenarios
- change Items order
- add Item to a List in every possible position 
- copy and paste similar configuration
- edit multiple settings "at once" 