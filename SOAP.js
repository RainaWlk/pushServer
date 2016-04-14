var util = require('util');
var $ = require('./jquery.js');

var SOAP_NAMESPACE = "http://tempuri.org/";

function SOAPAction(res)
{
	this.res = res;
};

exports.SOAPAction = SOAPAction;

// @prototype
SOAPAction.prototype = 
{
	//property
	timeout:0
}

// Summary:
//  Generate the xml content for the SOAP action
SOAPAction.prototype.createValueBody = function(aPara)
{
	
	var body = "";

    for (var obj in aPara)
    {
		//skip internal var or function name
		if((obj.charAt(0) == '_')||(obj == "push"))
			continue;

		//array type
		if((typeof aPara[obj] == 'undefined')||(aPara[obj] == null)||(aPara[obj].toString() == ""))
		{
			body += "<" + obj + "/>\n";	//empty data
		}
		else if(util.isArray(aPara[obj]) == true)
		{
			for(var arrayObj in aPara[obj])
			{
				var subobj = aPara[obj][arrayObj];

				if(typeof subobj == "object")
				{
					body += "<"+obj+">";
					body += this.createValueBody(subobj);
					body += "</"+obj+">\n";
				}
				else
				{//bug: no <obj>
					body += "<String>"+subobj+"</String>\n";
				}

			}
		}
		else if((typeof obj != "string") || (obj.length > 0))	//object type or single data type
        {
			body += "<"+obj+">";
            
            // when we don't have children to set

			if((typeof(aPara[obj]) == "object")&&(aPara[obj] != null))
            {
				body += this.createValueBody(aPara[obj]);
				
            }
            else
            {    
	            aPara[obj] = aPara[obj].toString().replace(/&/g, '&amp;');        
				aPara[obj] = aPara[obj].toString().replace(/</g, '&lt;');
				aPara[obj] = aPara[obj].toString().replace(/>/g, '&gt;');			
				aPara[obj] = aPara[obj].toString().replace(/"/g, '&quot;');
				aPara[obj] = aPara[obj].toString().replace(/'/g, '&apos;');
				//aPara[obj] = aPara[obj].toString().replace(/ /g, '&nbsp;');
				body += aPara[obj];
				
            }
            
			body += "</"+obj+">\n";
			
        }
    }
	
	return body;
}

// Summary:
//  To create a SOAP XML content
SOAPAction.prototype.createActionBody = function(aSoapAction, aPara, result)
{
	var body = "";
    
		body += "<" + aSoapAction + 'Response xmlns="' + SOAP_NAMESPACE + '">\n';
		body += "<" + aSoapAction + 'Result>' + result + '</' + aSoapAction + 'Result>\n';

		if ((typeof aPara == "object")&&(aPara != null))
		{
			body += this.createValueBody(aPara);
		}
		body += "</" + aSoapAction + "Response>\n";
    
    return body;
}

SOAPAction.prototype.createSOAP = function(aPara)
{
	var body = '<?xml version="1.0" encoding="utf-8"?>';
	body += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
	body += "<soap:Body>";
	body += aPara;
	body += "</soap:Body></soap:Envelope>";
    return body;
}

// Summary:
//  Send a SOAP action to the device
SOAPAction.prototype.sendSOAPAction = function(aSoapAction, aPara, result)
{
	//init
	var self = this;
    //SOAP Message to Send
	var body = self.createActionBody(aSoapAction, aPara, result);
	body = self.createSOAP(body);
	var soapActionURI = '"'+SOAP_NAMESPACE + aSoapAction + '"';
	this.res.setHeader("SOAPAction", soapActionURI);
	this.res.contentType('text/xml');
		
	this.res.send(body);
}

