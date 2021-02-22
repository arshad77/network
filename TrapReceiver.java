// package com.sify.utils;

import java.io.IOException;
import java.net.DatagramSocket;
import java.util.List;
import java.util.Vector;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;

import org.snmp4j.CommandResponder;
import org.snmp4j.CommandResponderEvent;
import org.snmp4j.CommunityTarget;
import org.snmp4j.MessageDispatcher;
import org.snmp4j.MessageDispatcherImpl;
import org.snmp4j.PDU;
import org.snmp4j.PDUv1;
import org.snmp4j.Snmp;
import org.snmp4j.mp.MPv1;
import org.snmp4j.mp.MPv2c;
import org.snmp4j.security.Priv3DES;
import org.snmp4j.security.SecurityProtocols;
import org.snmp4j.smi.Integer32;
import org.snmp4j.smi.OctetString;
import org.snmp4j.smi.TcpAddress;
import org.snmp4j.smi.TransportIpAddress;
import org.snmp4j.smi.UdpAddress;
import org.snmp4j.smi.VariableBinding;
import org.snmp4j.transport.AbstractTransportMapping;
import org.snmp4j.transport.DefaultTcpTransportMapping;
import org.snmp4j.transport.DefaultUdpTransportMapping;
import org.snmp4j.util.MultiThreadedMessageDispatcher;
import org.snmp4j.util.ThreadPool;

public class TrapReceiver implements CommandResponder {

	DatagramSocket ds = null;
	TrapReceiver recever = null;
	// static int count =0;

	public static void main(String[] args) {
		System.out.println("Trap Receiver ....");
		TrapReceiver snmp4jTrapReceiver = new TrapReceiver();
		String receiverIp_port = "127.0.0.1/162";
		try {
			snmp4jTrapReceiver.listen(new UdpAddress(receiverIp_port));
		} catch (IOException e) {
			e.printStackTrace();
		} 

		while (true) {
			try {
				Thread.sleep(60000);
			} catch (InterruptedException e1) {
				e1.printStackTrace();
			}
		}
	}

	/**
	 * Trap Listner
	 */
	public synchronized void listen(TransportIpAddress address) throws IOException {

		AbstractTransportMapping transport;
		if (address instanceof TcpAddress) {
			transport = new DefaultTcpTransportMapping((TcpAddress) address);
		} else {
			transport = new DefaultUdpTransportMapping((UdpAddress) address);
		}

		ThreadPool threadPool = ThreadPool.create("DispatcherPool", 10250);
		MessageDispatcher mDispathcher = new MultiThreadedMessageDispatcher(threadPool, new MessageDispatcherImpl());

		// add message processing models
		mDispathcher.addMessageProcessingModel(new MPv1());
		mDispathcher.addMessageProcessingModel(new MPv2c());

		// add all security protocols
		SecurityProtocols.getInstance().addDefaultProtocols();
		SecurityProtocols.getInstance().addPrivacyProtocol(new Priv3DES());

		// Create Target
		CommunityTarget target = new CommunityTarget();
		target.setCommunity(new OctetString("public"));

		Snmp snmp = new Snmp(mDispathcher, transport);
		snmp.addCommandResponder(this);

		transport.listen();
		System.out.println("Listening on : " + address);

		try {
			this.wait();
		} catch (InterruptedException ex) {
			Thread.currentThread().interrupt();
		}
	}

	public  void postNow(PDU pdu) throws IOException {
		// count = count + 1;
    URL url = new URL("https://dev97972.service-now.com/api/now/table/x_572191_itreq_trap");
    HttpURLConnection con = (HttpURLConnection)url.openConnection();
    con.setRequestMethod("POST");
    con.setRequestProperty("Content-Type", "application/json; utf-8");
    String userCredentials = "admin:jt3HVxgdZHZ8";
    String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));
    con.setRequestProperty ("Authorization", basicAuth);  
    con.setRequestProperty("Accept", "application/json");
    con.setDoOutput(true);
		Integer32 traprequestId = pdu.getRequestID();
		String requestID = traprequestId.toString();
		String errorStatus = pdu.getErrorStatusText();
		String errorIndex = Integer.toString(pdu.getErrorIndex());
		List<? extends VariableBinding> variableBindings = pdu.getVariableBindings();
		String vb = variableBindings.toString();

    String jsonInputString = "{\"errorindex\":\""+errorIndex+"\",\"errorstatus\":\""+errorStatus+"\",\"id\":\""+requestID+"\",\"variablebindings\":\""+vb+"\"}";
    try(OutputStream os = con.getOutputStream()) {
      byte[] input = jsonInputString.getBytes("utf-8");
      os.write(input, 0, input.length);			
    }
    try(BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"))) 
		{
      StringBuilder response = new StringBuilder();
      String responseLine = null;
      while ((responseLine = br.readLine()) != null) {
          response.append(responseLine.trim());
      }
      // System.out.println(response.toString());
			// System.out.println(count+"threads completed");
     }
  }
	/**
	 * This method will be called whenever a pdu is received on the given port
	 * specified in the listen() method
	 */
	/**
	 * Connects to the server.
	 * 
	 * @return True : If connection succeeded. False : If connection failed.
	 */
	public synchronized void processPdu(CommandResponderEvent cmdRespEvent) {
		// System.out.println("Received PDU...");

		try {
			// String senderAddress = null;
			PDU pdu = cmdRespEvent.getPDU();
			// if (pdu != null) {
			// 	senderAddress = ((UdpAddress) cmdRespEvent.getPeerAddress()).getInetAddress().getHostAddress();
			// 	// System.out.println(senderAddress);
			// 	if (pdu instanceof PDUv1) {
			// 		PDUv1 pduV1 = (PDUv1) pdu;
			// 		senderAddress = pduV1.getAgentAddress().toString();
			// 	}
			// 	String msgPdu = pdu.toString();
			// 	// System.out.println(msgPdu);
			// 	this.postNow(pdu);
			// 	// Integer32 traprequestId = pdu.getRequestID();
			// 	// String requestID = traprequestId.toString();
			// 	// // System.out.println(requestID);
			// 	// String errorStatus = pdu.getErrorStatusText();
			// 	// System.out.println(errorStatus);
			// 	// String errorIndex = Integer.toString(pdu.getErrorIndex());
			// 	// System.out.println(errorIndex);
			// 	// List<? extends VariableBinding> variableBindings = pdu.getVariableBindings();
			// 	// // System.out.println(variableBindings.toString());
			// 	// // System.out.println();
			// 	// String trapReceived = "sourceip##" + senderAddress + ";";
			// 	// System.out.println(trapReceived);
			// 	// System.out.println();
			// 	if (pdu != null) {
			// 		Vector<VariableBinding> varlist = (Vector<VariableBinding>) pdu.getVariableBindings();
			// 		VariableBinding varbind;
			// 		String folder_name = null;
			// 		// System.out.println("inside ....");
			// 		// System.out.println(varlist);
			// 		// System.out.println(varlist.size());
			// 		for (int i = 0; i < varlist.size(); i++) {
			// 			varbind = (VariableBinding) varlist.get(i);
			// 			// System.out.println(varbind);
			// 			// System.out.println();
			// 		}
			// 	}
			// }
			URL url = new URL("https://dev97972.service-now.com/api/now/table/x_572191_itreq_trap");
    HttpURLConnection con = (HttpURLConnection)url.openConnection();
    con.setRequestMethod("POST");
    con.setRequestProperty("Content-Type", "application/json; utf-8");
    String userCredentials = "admin:jt3HVxgdZHZ8";
    String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));
    con.setRequestProperty ("Authorization", basicAuth);  
    con.setRequestProperty("Accept", "application/json");
    con.setDoOutput(true);
		Integer32 traprequestId = pdu.getRequestID();
		String requestID = traprequestId.toString();
		String errorStatus = pdu.getErrorStatusText();
		String errorIndex = Integer.toString(pdu.getErrorIndex());
		List<? extends VariableBinding> variableBindings = pdu.getVariableBindings();
		String vb = variableBindings.toString();

    String jsonInputString = "{\"errorindex\":\""+errorIndex+"\",\"errorstatus\":\""+errorStatus+"\",\"id\":\""+requestID+"\",\"variablebindings\":\""+vb+"\"}";
    try(OutputStream os = con.getOutputStream()) {
      byte[] input = jsonInputString.getBytes("utf-8");
      os.write(input, 0, input.length);			
    }
		try(BufferedReader br = new BufferedReader(
    new InputStreamReader(con.getInputStream(), "utf-8"))) {
      StringBuilder response = new StringBuilder();
      String responseLine = null;
      while ((responseLine = br.readLine()) != null) {
          response.append(responseLine.trim());
      }
      // System.out.println(response.toString());
			// System.out.println(count+"threads completed");
     }
		} catch (Exception e) {
		}

	} 

}
