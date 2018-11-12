# FocusShift

        var onKey = $.onKey('KEY_UP', 'KEY_DOWN', 'KEY_LEFT', 'KEY_RIGHT', 'KEY_SELECT');
        eg: onKey.currentItem
        window.document.onkeydown = function (event) {
        
                var event = event || window.event;
                
                var keyCode = Event(event);
                
                onKey.E(keyCode, function (on, key, dom, $isOtherGroup) {
                
                 switch (key) {
                 
                      case 'KEY_LEFT':
                      
                        dom operate...
                        
                        break;
                        
                      case 'KEY_RIGHT':
                      
                        ...
                        
                        break;
                        
                      case 'KEY_UP':
                      
                        ...
                        
                        break;
                        
                      case 'KEY_DOWN':
                      
                        ...
                        
                        break;
                        
                      case 'KEY_SELECT':
                      
                        ...
                        
                        break;
                        
                      default:
                      
                        break;
                        
                }
            })
         }
