import { Component, ElementRef, AfterViewInit,ViewChild, OnInit, Renderer2 } from '@angular/core';
import { jsPlumb  } from 'jsplumb';
import { v4 as uuid } from 'uuid';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Angular JsPlumb Integration';
  jsPlumbInstance;
  showConnectionToggle = false;
  buttonName = 'Connect';
  idSample;
  objectName;
  commonTargetAnd = {
    isSource:false,
    isTarget:true,
    connector:"Straight",
    endpoint:"Rectangle",
    paintStyle:{ fill:"white", outlineStroke:"blue", strokeWidth:3 },
    hoverPaintStyle:{ outlineStroke:"lightblue" },
    connectorStyle:{ outlineStroke:"green", strokeWidth:1 },
    connectorHoverStyle:{ strokeWidth:2 },
    parameters: { type: 'AND'},
    maxConnections: 1,
  };
  commonSourceAnd = {
    isSource:true,
    isTarget:false,
    connector:"Straight",
    endpoint:"Rectangle",
    paintStyle:{ fill:"white", outlineStroke:"blue", strokeWidth:3 },
    hoverPaintStyle:{ outlineStroke:"lightblue" },
    connectorStyle:{ outlineStroke:"green", strokeWidth:1 },
    connectorHoverStyle:{ strokeWidth:2 },
    parameters: { type: 'AND'},
    maxConnections: -1
  };
  commonTargetOr = {
    isSource:false,
    isTarget:true,
    connector:"Straight",
    endpoint:"Rectangle",
    paintStyle:{ fill:"white", outlineStroke:"blue", strokeWidth:3 },
    hoverPaintStyle:{ outlineStroke:"lightblue" },
    connectorStyle:{ outlineStroke:"green", strokeWidth:1 },
    connectorHoverStyle:{ strokeWidth:2 },
    parameters: { type: 'OR'},
    maxConnections:1,
  };
  commonSourceOr = {
    isSource:true,
    isTarget:false,
    connector:"Straight",
    endpoint:"Rectangle",
    paintStyle:{ fill:"white", outlineStroke:"blue", strokeWidth:3 },
    hoverPaintStyle:{ outlineStroke:"lightblue" },
    connectorStyle:{ outlineStroke:"green", strokeWidth:1 },
    connectorHoverStyle:{ strokeWidth:2 },
    parameters: { type: 'OR'},
    maxConnections: -1
  };
  commonTargetNot = {
    isSource:false,
    isTarget:true,
    connector:"Straight",
    endpoint:"Rectangle",
    paintStyle:{ fill:"white", outlineStroke:"blue", strokeWidth:3 },
    hoverPaintStyle:{ outlineStroke:"lightblue" },
    connectorStyle:{ outlineStroke:"green", strokeWidth:1 },
    connectorHoverStyle:{ strokeWidth:2 },
    maxConnections:1,
    parameters: { type: 'NOT'},
  };
  commonSourceNot = {
    isSource:true,
    isTarget:false,
    connector:"Straight",
    endpoint:"Rectangle",
    paintStyle:{ fill:"white", outlineStroke:"blue", strokeWidth:3 },
    hoverPaintStyle:{ outlineStroke:"lightblue" },
    connectorStyle:{ outlineStroke:"green", strokeWidth:1 },
    connectorHoverStyle:{ strokeWidth:2 },
    maxConnections:1,
    parameters: { type: 'NOT'}
  };
  commonTargetObject = {
    isSource:false,
    isTarget:true,
    connector:"Straight",
    endpoint:"Rectangle",
    paintStyle:{ fill:"white", outlineStroke:"blue", strokeWidth:3 },
    hoverPaintStyle:{ outlineStroke:"lightblue" },
    connectorStyle:{ outlineStroke:"green", strokeWidth:1 },
    connectorHoverStyle:{ strokeWidth:2 },
    maxConnections:1,
    parameters: { type: 'OBJECT'},
  };
  commonSourceStart = {
    isSource:true,
    isTarget:false,
    connector:"Straight",
    endpoint:"Rectangle",
    paintStyle:{ fill:"white", outlineStroke:"blue", strokeWidth:3 },
    hoverPaintStyle:{ outlineStroke:"lightblue" },
    connectorStyle:{ outlineStroke:"green", strokeWidth:1 },
    connectorHoverStyle:{ strokeWidth:2 },
    maxConnections:1,
    parameters: { type: 'START'},
  };
  @ViewChild('container') d1:ElementRef;
  constructor(private renderer:Renderer2)  {    }
  ngOnInit() {
    this.idSample = uuid();
  }
  ngAfterViewInit() {
    
    this.jsPlumbInstance = jsPlumb.getInstance();
    var test = this.jsPlumbInstance;
    this.jsPlumbInstance.setContainer("diagramContainer");
    /**
     * Add Start Point
     */
    this.d1.nativeElement.insertAdjacentHTML('beforeend', '<div _ngcontent-c0 id="0" class="item rectangle" style="top: 200px;left:150px;">Start Point</div>');
      this.jsPlumbInstance.addEndpoint("0".toString(), { 
        anchor:"Bottom"
      }, this.commonSourceStart); 
      this.jsPlumbInstance.draggable("0".toString(),{containment: 'diagramContainer'});
     //
    this.jsPlumbInstance.bind('connection', function(info, orginalEvent){
      if(info.targetEndpoint.getParameters() && info.sourceEndpoint.getParameters()) {
        const sourceType = info.sourceEndpoint.getParameters().type;
        const targetType = info.targetEndpoint.getParameters().type;
        
        if(targetType === 'OBJECT') {
          if(!(sourceType === 'OR' || sourceType === 'AND' || sourceType === 'START')) {
            test.deleteConnection(info.connection);
          }
        }
        if(targetType === 'OR' || targetType === 'AND') {
          if(!(sourceType === 'OR' || sourceType === 'AND' || sourceType === 'NOT' || sourceType === 'START')) {
            test.deleteConnection(info.connection);
          }
        }
        if(sourceType === 'NOT') {
          if(!(targetType === 'OR' || targetType === 'AND' || sourceType === 'START')) {
            test.deleteConnection(info.connection);
          }
        }
        if(targetType === 'NOT') {
          if(!(sourceType === 'OR' || sourceType === 'AND' || sourceType === 'START')) {
            test.deleteConnection(info.connection);
          }
        }
      } else {
        test.deleteConnection(info.connection);
      }
    });
  }
  result(){
    debugger;
    let error = '';
    const connections = this.jsPlumbInstance.getConnections();
    if(connections.length > 0) {
      const startConnection = connections.find(filter => filter.sourceId === '0');
      if(startConnection){
        connections.forEach(connection => {
          if(connection.sourceId !== '0') {
            connection.endpoints.forEach(endpoint => {
              const endpointType =  endpoint.getParameters().type;
              if((endpointType === 'AND' || endpointType === 'OR' || endpointType === 'NOT')){
                var temp = this.jsPlumbInstance;
                const targeted = this.jsPlumbInstance.getConnections({target: [endpoint.elementId]});
                const sourced = this.jsPlumbInstance.getConnections({source: [endpoint.elementId]});
                if(!(targeted.length > 0 && sourced.length  > 0)) {
                  error = 'Not connected Node Detected';
                }
              }              
              if((endpointType === 'OBJECT')) {
                if(!(endpoint.connections.length  === 1)) {
                  error = 'Not connected Object Detected';
                }
              }              
            });
          }
        });
      } else {
        error = 'Start point should be connected'
      }
    } else {
      error = 'No Connection'
    }
    console.log(this.jsPlumbInstance.getConnections());
    console.error(error);
  }
  deleteNode(event, id){
    debugger;
    this.jsPlumbInstance.remove(id);
  }
  add(type){
    debugger;
    this.jsPlumbInstance.setContainer("diagramContainer");
    const id = this.idSample;
    debugger;
    console.log(id);
    let newDiv = this.renderer.createElement('div');
    this.renderer.addClass(newDiv, 'item');
    this.renderer.setAttribute(newDiv, 'id', id);

    let deleteSpan = this.renderer.createElement('span');
    this.renderer.addClass(deleteSpan, 'badge');
    this.renderer.addClass(deleteSpan, 'badge-dark');
    this.renderer.listen(deleteSpan,'click', (event) => {this.deleteNode( event, id)})
    const textSpan = this.renderer.createText('X');
    this.renderer.appendChild(deleteSpan, textSpan);

    this.renderer.appendChild(newDiv, deleteSpan);
    if( type === 'OR') {
      this.renderer.addClass(newDiv, 'rectangle');
      const textDiv = this.renderer.createText('OR');
      this.renderer.appendChild(newDiv, textDiv);
      this.renderer.appendChild(this.d1.nativeElement, newDiv);
      this.jsPlumbInstance.addEndpoint(id.toString(), { 
        anchor:"Top"
      }, this.commonTargetOr);
      this.jsPlumbInstance.addEndpoint(id.toString(), { 
        anchor:"Bottom"
      }, this.commonSourceOr); 
      this.jsPlumbInstance.draggable(id.toString(),{containment: 'diagramContainer'});
    } else if( type === 'AND') {
      this.renderer.addClass(newDiv, 'rectangle');
      const textDiv = this.renderer.createText('AND');
      this.renderer.appendChild(newDiv, textDiv);
      this.renderer.appendChild(this.d1.nativeElement, newDiv);
      this.jsPlumbInstance.addEndpoint(id.toString(), { 
        anchor:"Top"
      }, this.commonTargetAnd);
      this.jsPlumbInstance.addEndpoint(id.toString(), { 
        anchor:"Bottom"
      }, this.commonSourceAnd); 
      this.jsPlumbInstance.draggable(id.toString(),{containment: 'diagramContainer'});
    } else if( type === 'NOT') {
      this.renderer.addClass(newDiv, 'triangle');
      const textDiv = this.renderer.createText('NOT');
      this.renderer.appendChild(newDiv, textDiv);
      this.renderer.appendChild(this.d1.nativeElement, newDiv);
      this.jsPlumbInstance.addEndpoint(id.toString(), { 
        anchor:"Top"
      }, this.commonTargetNot);
      this.jsPlumbInstance.addEndpoint(id.toString(), { 
        anchor:"Bottom"
      }, this.commonSourceNot); 
      this.jsPlumbInstance.draggable(id.toString(),{containment: 'diagramContainer'});
    }
    this.idSample = uuid();
  }
  addObject() {
    const id = this.idSample;
    let newDiv = this.renderer.createElement('div');
    this.renderer.addClass(newDiv, 'item');
    this.renderer.setAttribute(newDiv, 'id', id);

    let deleteSpan = this.renderer.createElement('span');
    this.renderer.addClass(deleteSpan, 'badge');
    this.renderer.addClass(deleteSpan, 'badge-dark');
    this.renderer.listen(deleteSpan,'click', (event) => {this.deleteNode( event, id)})
    const textSpan = this.renderer.createText('X');
    this.renderer.appendChild(deleteSpan, textSpan);
    this.renderer.appendChild(newDiv, deleteSpan);
    this.renderer.addClass(newDiv, 'circle');
    const textDiv = this.renderer.createText(this.objectName );
    this.renderer.appendChild(newDiv, textDiv);
    this.renderer.appendChild(this.d1.nativeElement, newDiv);

      this.jsPlumbInstance.addEndpoint(id.toString(), { 
        anchor:"Top"
      }, this.commonTargetObject);
    this.jsPlumbInstance.draggable(id.toString(),{containment: 'diagramContainer'});
    this.idSample = uuid();
  }
}
