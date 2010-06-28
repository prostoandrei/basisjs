
  window.DemoLocale = {
    TABS: {
      DEMO: 'Demo',
      DESCRIPTION: 'Description',
      SOURCE: 'Source code'
    }
  };

  document.write('<style type="text/css">@import "../demo.css";@import "../../third_party/SyntaxHighlighter/styles/shCore.css";@import "../../third_party/SyntaxHighlighter/styles/shThemeDefault.css";</style>');
  document.write('shCore'.qw().map(String.format, '<script language="javascript" src="../../third_party/SyntaxHighlighter/src/{0}.js"></script>').join(''));
  document.write('shBrushJScript shBrushCss'.qw().map(String.format, '<script language="javascript" src="../../third_party/SyntaxHighlighter/scripts/{0}.js"></script>').join(''));
  
  Basis.Event.onLoad(function(){
    
    var DOM = Basis.DOM;
    var Event = Basis.Event;
    var Data = Basis.Data;
    var cssClass = Basis.cssClass;

    var highlight = Function.runOnce(function(){
      SyntaxHighlighter.highlight({}, DOM.get('javascript'));
      SyntaxHighlighter.highlight({}, DOM.get('css'));
    });

    var cssSource, jsSource;
    var pages = [
      {
        title: DemoLocale.TABS.DEMO,
        element: DOM.createElement('#Demo-MainPage', DOM.get('demo-summary'), DOM.get('demo-container'))
      },
      {
        title: DemoLocale.TABS.DESCRIPTION,
        element: DOM.createElement('#Demo-DescriptionPage', DOM.get('demo-description'))
      },
      {
        title: DemoLocale.TABS.SOURCE,
        element: DOM.createElement('#Demo-SourcePage',
          DOM.createElement('H2', 'Included resources'),
          DOM.createElement('UL',
            DOM.wrap(
              DOM
                .tag('SCRIPT')
                .map(Data.getter('getAttribute("src")'))
                .filter(String.isNotEmpty)
                .filter(function(value){ return !/third_party/.test(value) && !/demo\.js/.test(value) })
                .map(function(value){ return DOM.createElement('A[href={0}]'.format(value.quote()), value.replace(/^([\.]+\/)+/, '')) }),
              { 'LI': Function.$true }
            )
          ),
          DOM.createElement('H2', 'CSS'),
          cssSource = DOM.createElement('PRE#css', DOM.get('demo-css').innerHTML),
          DOM.createElement('H2', 'Javascript'),
          jsSource = DOM.createElement('PRE#javascript', DOM.get('demo-javascript').innerHTML)
        )
      }
    ];
    var tabs = DOM.createElement('#DemoTabs', DOM.wrap(pages, { '.DemoWrapper-Tab': Function.$true }, 'title'));
    cssClass(tabs.firstChild).add('selected');
    
    cssSource.className = 'brush: css';
    jsSource.className = 'brush: javascript';

    Event.addHandler(tabs, 'click', function(event){
      var sender = Event.sender(event);
      var cssClassSender = cssClass(sender);
      if (cssClassSender.has('DemoWrapper-Tab'))
      {
        DOM.axis(tabs, DOM.AXIS_CHILD).forEach(function(tab, idx){
          cssClass(tab).bool('selected', tab == sender);
          DOM.display(pages[idx].element, tab == sender);
        });
        if (sender == sender.parentNode.lastChild)
          highlight();
      }
    });
    
    pages.forEach(function(page, idx){ DOM.display(page.element, !idx) });

    DOM.insert(document.body, [
      DOM.createElement('A#backLink[href="../index.html"]', 'Back to demos'),
      DOM.createElement('#DemoWrapper',
        tabs,
        DOM.wrap(pages, { '.DemoWrapper-Page': Function.$true }, 'element')
      ),
      DOM.createElement('#DemoCopy', DOM.createElement('P', 'Basis ' + String.Entity.copy + ' 2006-2010, home page'))
    ]);

    cssClass(document.body).add('show');
  });