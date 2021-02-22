// package com.sify.utils;

import org.snmp4j.CommunityTarget;
import org.snmp4j.PDU;
import org.snmp4j.Snmp;
import org.snmp4j.TransportMapping;
import org.snmp4j.mp.SnmpConstants;
import org.snmp4j.smi.OID;
import org.snmp4j.smi.OctetString;
import org.snmp4j.smi.UdpAddress;
import org.snmp4j.smi.VariableBinding;
import org.snmp4j.transport.DefaultUdpTransportMapping;

public class TrapSender {
	static int count = 0;
	public void sendTrap(PDU pdu) {

		try {
			TransportMapping transport = new DefaultUdpTransportMapping();
			transport.listen();

			CommunityTarget cTarget = new CommunityTarget();
			cTarget.setCommunity(new OctetString(""));
			cTarget.setVersion(SnmpConstants.version2c);
			cTarget.setAddress(new UdpAddress("127.0.0.1" + "/" + 162));
			cTarget.setRetries(2);
			cTarget.setTimeout(5000);
 
			// Send the PDU
			Snmp snmp = new Snmp(transport);
			snmp.send(pdu, cTarget);
			// count = count + 1;
			snmp.close();

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	private PDU getPDU_MemUtil() {

		PDU pdu = new PDU();
		pdu.add(new VariableBinding(new OID("1.3.6.1.2.1.1.3.0"), new OctetString("0:00:00.10")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.6.3.1.1.4.1.0"), new OctetString("1.3.6.1.4.1.12028.4.15.0.25")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.101"), new OctetString("2")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.102"), new OctetString("4")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.104"), new OctetString("221.135.104.20")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.103"), 
																new OctetString("Device: b4:5d:50:ca:65:a2 (221-135-104-20.sify.net) - https://172.29.22.130/ap_monitoring?id=280:Percent Memory Utilization >= 80% for 5 minutes. Notes: MEMORY UTILIZATION THRESHOLD ALERT.; 1.3.6.1.4.1.12028.4.104 = 221.135.104.20; 1.3.6.1.4.1.12028.4.117 = Top > TEST")));
		pdu.setType(PDU.NOTIFICATION);
		return pdu;
	}

	private PDU getPDU_InterfaceError() {

		PDU pdu = new PDU();
		pdu.add(new VariableBinding(new OID("1.3.6.1.2.1.1.3.0"), new OctetString("0:00:00.10")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.6.3.1.1.4.1.0"), new OctetString("1.3.6.1.4.1.12028.4.15.0.25")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.101"), new OctetString("2")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.102"), new OctetString("4")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.103 "), new OctetString(
				"Interface: NULL0 on TN-MAA-TDL-T1-ST-OALAN-CBLK-100.65.83.31 - https://172.29.22.130/interface_monitoring?id=191&interface_id=2006: Interface Errors Interface Errors Combined (%) < 50% for 60 minutes. Notes: INTERFACE ERROR IS CROSSED MORE THAN 50 % IN 1 HOUR; 1.3.6.1.4.1.12028.4.104 = 100.65.83.31; 1.3.6.1.4.1.12028.4.117 = Top > CHN_TDL_IAP")));
		pdu.setType(PDU.NOTIFICATION);
		return pdu;
	}

	private PDU getPDU_ChannelUtilIntf() {

		PDU pdu = new PDU();
		pdu.add(new VariableBinding(new OID("1.3.6.1.2.1.1.3.0"), new OctetString("0:00:00.10")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.6.3.1.1.4.1.0"), new OctetString("1.3.6.1.4.1.12028.4.15.0.25")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.101"), new OctetString("2")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.102"), new OctetString("4")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.104"), new OctetString("221.135.104.20")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.103 "), new OctetString(
				"Device: b4:5d:50:ca:65:a2 (221-135-104-20.sify.net) (radio 802.11bgn) - https://172.29.22.130/radio_statistics?id=280&radio_index=1: Channel Utilization Interference (%) >= 50% and Radio Type is 2.4Ghz (802.11 b/g/n) for 30 minutes. Notes: CHANNEL UTILIZATION THERSHOLD TRIGGER.; 1.3.6.1.4.1.12028.4.104 = 221.135.104.20; 1.3.6.1.4.1.12028.4.117 = Top > TEST")));
		pdu.setType(PDU.NOTIFICATION);
		return pdu;
	}

	private PDU getPDU_RadioNoise() {

		PDU pdu = new PDU();
		pdu.add(new VariableBinding(new OID("1.3.6.1.2.1.1.3.0"), new OctetString("0:00:00.10")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.6.3.1.1.4.1.0"), new OctetString("1.3.6.1.4.1.12028.4.15.0.25")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.101"), new OctetString("2")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.102"), new OctetString("4")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.104"), new OctetString("221.135.104.20")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.103 "), new OctetString(
				"Device: b4:5d:50:ca:65:a2 (221-135-104-20.sify.net) (radio 802.11ac) - https://172.29.22.130/radio_statistics?id=280&radio_index=2: Radio Noise Floor Device Type is Access Point, Noise Floor(dBM) >= -87 dBM and Radio Type is 5GHz (802.11 a/n) for 30 minutes. Notes: DEVICE NOISE FLOOR THRESHOLD TRIGGER. ; 1.3.6.1.4.1.12028.4.104 = 221.135.104.20; 1.3.6.1.4.1.12028.4.117 = Top > TEST")));
		pdu.setType(PDU.NOTIFICATION);
		return pdu;
	}

	private PDU getPDU_ClientCount() {

		PDU pdu = new PDU();
		pdu.add(new VariableBinding(new OID("1.3.6.1.2.1.1.3.0"), new OctetString("0:00:00.10")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.6.3.1.1.4.1.0"), new OctetString("1.3.6.1.4.1.12028.4.15.0.25")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.101"), new OctetString("2")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.102"), new OctetString("4")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.104"), new OctetString("221.135.104.20")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.103 "), new OctetString(
				"Device: b4:5d:50:ca:65:a2 (221-135-104-20.sify.net) - https://172.29.22.130/ap_monitoring?id=280: Client Count Device Name: b4:5d:50:ca:65:a2 (221-135-104-20.sify.net) Client Count on Devices is at most 25 and Device Type is Access Point for 30 minutes. Notes: TOTAL CLIENTS CONNECTED THRESHOLD AS 30.; 1.3.6.1.4.1.12028.4.104 = 221.135.104.20; 1.3.6.1.4.1.12028.4.117 = Top > TEST")));
		pdu.setType(PDU.NOTIFICATION);
		return pdu;
	}

	private PDU getPDU_DeviceRadiusAuth() {

		PDU pdu = new PDU();
		pdu.add(new VariableBinding(new OID("1.3.6.1.2.1.1.3.0"), new OctetString("0:00:00.10")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.6.3.1.1.4.1.0"), new OctetString("1.3.6.1.4.1.12028.4.15.0.25")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.101"), new OctetString("2")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.102"), new OctetString("4")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.104"), new OctetString("221.135.104.20")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.103 "), new OctetString(
				"Device: 2FLR_DBLOCK_TRAIN_83.91 - https://172.29.22.130/ap_monitoring?id=221: Device RADIUS Authentication Issues Count >= 10 and Device Type is Access Point for 10 minutes. Notes: DEVICE RADIUS AUTH ISSUE TRIGGER.; 1.3.6.1.4.1.12028.4.104 = 100.65.83.91; 1.3.6.1.4.1.12028.4.117 = Top > CHN_TDL_IAP")));
		pdu.setType(PDU.NOTIFICATION);
		return pdu;
	}

	private PDU getPDU_TotalRaduisAccountinIssue() {

		PDU pdu = new PDU();
		pdu.add(new VariableBinding(new OID("1.3.6.1.2.1.1.3.0"), new OctetString("0:00:00.10")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.6.3.1.1.4.1.0"), new OctetString("1.3.6.1.4.1.12028.4.15.0.25")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.101"), new OctetString("2")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.102"), new OctetString("4")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.103 "), new OctetString(
				" Total RADIUS Accounting Issues Count >= 10 for 60 minutes. Notes: TOTAL RADIUS ACCOUNTING ISSUE THRESHOLD TRIGGER ALERTS..; 1.3.6.1.4.1.12028.4.117 = Top > TEST")));
		pdu.setType(PDU.NOTIFICATION);
		return pdu;
	}

	private PDU getPDU_DevicesIDSAccount() {

		PDU pdu = new PDU();
		pdu.add(new VariableBinding(new OID("1.3.6.1.2.1.1.3.0"), new OctetString("0:00:00.10")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.6.3.1.1.4.1.0"), new OctetString("1.3.6.1.4.1.12028.4.15.0.25")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.101"), new OctetString("2")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.102"), new OctetString("4")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.104"), new OctetString("221.135.104.20")));
		pdu.add(new VariableBinding(new OID("1.3.6.1.4.1.12028.4.15.1.103 "), new OctetString(
				"Device: 3FLR-Nblock-MITS-central-83.84 - https://172.29.22.130/ap_monitoring?id=92: Device IDS Events Count >= 10 for 60 minutes. Notes: DEVICE IDS EVENTS TRIGGER.; 1.3.6.1.4.1.12028.4.104 = 100.65.83.84; 1.3.6.1.4.1.12028.4.117 = Top > CHN_TDL_IAP")));
		pdu.setType(PDU.NOTIFICATION);
		return pdu;
	}

	public static void main(String[] args) {
		
		// sender.sendTrap(pdu);
			for(int j=0;j<1000;j++){
				new Thread("" + j){
					public void run(){
						TrapSender sender = new TrapSender();
						PDU pdu = sender.getPDU_MemUtil();
						sender.sendTrap(pdu);
						// System.out.println(count + " Trap Sent");
					}
			}.start();	
      
    }
	}

}
