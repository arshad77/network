var Sify_Managed_Wifi = Class.create();
Sify_Managed_Wifi.prototype = {
    initialize: function() {
        //gs.info();
    },
    fetchDevices: function() {
        var json = {};
        var grce = new GlideRecord('x_sitl_telco_sify_u_cmdb_ci_sify_ce_device_managed_wifi');
        grce.query();
        var data = [];
        while (grce.next()) {
            var da = {};
            da.id = grce.u_airwave_id.toString();
            da.ip = grce.ip_address.toString();
            data.push(da);
        }
        json.data = data;
        return json;
    },
    getDeviceList: function(ip, username, password) {
        var startTime = new Date().getTime();
        var endTime = new Date().getTime();

        var reqDetails = {};
        var requestParams = {};
        requestParams.url = "ap_list.xml";
        requestParams.method = "GET";

        var dbDetails = {};
        dbDetails.IP = ip;
        dbDetails.username = username;
        dbDetails.password = password;

        reqDetails.requestParams = requestParams;
        reqDetails.dbDetails = dbDetails;

        reqDetails.isxml = "yes";
        var response = this.getDevices_MangedWifi(reqDetails);
        var res_json = JSON.parse(response).items[0];
        var aps = res_json["amp:amp_ap_list"].ap;
        //var xmldoc = new XMLDocument(xmlString);
        for (var i = 0; i < aps.length; i++) {
            //gs.info(aps[i]);
            this.insertIntoDb(aps[i], ip);
        }

        if (true) {
            endTime = new Date().getTime();
            var elapsed = endTime - startTime;
            //gs.info("Sify_Managed_Wifi:getDeviceList time taken::"+elapsed+" ms");
        }
    },

    getDevice: function(id, ip, username, password) {
        var reqDetails = {};
        var requestParams = {};
        requestParams.url = "/ap_list.xml?id=" + id;
        requestParams.method = "GET";

        var dbDetails = {};
        dbDetails.IP = ip;
        dbDetails.username = username;
        dbDetails.password = password;

        reqDetails.requestParams = requestParams;
        reqDetails.dbDetails = dbDetails;

        reqDetails.isxml = "yes";
        //gs.info(JSON.stringify(reqDetails));
        var response = this.getDevices_MangedWifi(reqDetails);
        var res_json = JSON.parse(response).items[0];
        //gs.info(res_json);
        return res_json;
    },
    insertIntoDb: function(ap, airwaveip) {
        var model = ap.model[0]._;
        if (model.toUpperCase().includes("CONTROLLER")) {
            this.processController(ap, airwaveip);
        } else {
            this.processAcessPoint(ap, airwaveip);
        }
        //gs.info("name="+ap.name[0]+" mfgr="+ap.mfgr[0]+" firmware="+ap.firmware[0]+" ip="+ap.lan_ip[0]+" model="+ap.model[0]._);
    },
    processAcessPoint: function(ap, airwaveip) {
        var grce = new GlideRecord('x_sitl_telco_sify_sify_aruba_ce_device_temp');
        grce.addQuery('ip_address', ap.lan_ip[0]);
        grce.addQuery('airwave_ip', airwaveip);
        grce.query();
        if (grce.getRowCount() > 0) {
            while (grce.next()) {
                grce.manufacturer = ap.mfgr[0];
                grce.firmware = ap.firmware[0];
                grce.ip_address = ap.lan_ip[0];
                grce.hostname = ap.name[0];
                grce.model_number = ap.model[0]._;
                var ids = ap.$;
                grce.airwave_id = ids.id;
                if (Array.isArray(ap.serial_number) && ap.serial_number.length) {
                    grce.serial_number = ap.serial_number[0];
                }
                var sysid1 = grce.sysid;
                grce.update();
                var intf1 = ap.radio;
                if (Array.isArray(intf1) && intf1.length) {
                    //	this.updateInterface(intf1,sysid1);
                }
            }
        } else {
            var grce1 = new GlideRecord('x_sitl_telco_sify_sify_aruba_ce_device_temp');
            grce1.initialize();
            grce1.name = ap.lan_ip[0];
            grce1.manufacturer = ap.mfgr[0];
            grce1.firmware = ap.firmware[0];
            grce1.ip_address = ap.lan_ip[0];
            grce1.hostname = ap.name[0];
            grce1.model_number = ap.model[0]._;
            grce1.airwave_ip = airwaveip;
            var idsu = ap.$;
            grce1.airwave_id = idsu.id;
            if (Array.isArray(ap.serial_number) && ap.serial_number.length) {
                grce1.serial_number = ap.serial_number[0];
            }
            var sysid = grce1.insert();
            var intf = ap.radio;
            if (Array.isArray(intf) && intf.length) {
                //	this.insertInterface(intf,sysid);
            }
        }
    },
    processController: function(ap, airwaveip) {
        var grce = new GlideRecord('x_sitl_telco_sify_sify_aruba_ce_device_temp');
        grce.addQuery('ip_address', ap.lan_ip[0]);
        grce.addQuery('airwave_ip', airwaveip);
        grce.query();
        if (grce.getRowCount() > 0) {
            while (grce.next()) {
                //grce.manufacturer =ap.mfgr[0];
                //grce.firmware =ap.firmware[0];
                //grce.ip_address = ap.lan_ip[0];
                grce.controller_name = ap.name[0];
                grce.ip_address = ap.lan_ip[0];
                grce.is_controller = true;
                //	if(Array.isArray(ap.serial_number) && ap.serial_number.length){
                //	   grce.serial_number=ap.serial_number[0];
                //	}
                grce.update();
            }
        } else {
            //gs.info('insert '+ap.lan_ip[0]+" "+ap.name[0]);
            var grce1 = new GlideRecord('x_sitl_telco_sify_sify_aruba_ce_device_temp');
            grce1.initialize();
            grce1.name = ap.lan_ip[0];
            //	grce1.manufacturer =ap.mfgr[0];
            //	grce1.firmware =ap.firmware[0];
            //	grce1.ip_address = ap.lan_ip[0];
            grce1.controller_name = ap.name[0];
            grce1.ip_address = ap.lan_ip[0];
            grce1.airwave_ip = airwaveip;
            //	if(Array.isArray(ap.serial_number) && ap.serial_number.length){
            //	   grce1.serial_number=ap.serial_number[0];
            //	}
            grce1.is_controller = true;
            grce1.insert();
        }
    },
    insertInterface: function(intfs, sysid) {
        for (var i = 0; i < intfs.length; i++) {
            var intf = intfs[i];
            var inft_grce = new GlideRecord('x_sitl_telco_sify_sify_aruba_customer_device_interface_temp');
            inft_grce.initialize();
            inft_grce.name = intf.radio_type[0];
            inft_grce.radio_interface = intf.radio_interface[0];
            inft_grce.interface_name = intf.radio_type[0];
            inft_grce.mac_address = intf.radio_mac[0];
            inft_grce.ce_device = sysid;
            inft_grce.insert();
            //gs.info("name="+intf.radio_type[0]+" radio_interface="+intf.radio_interface[0]+" mac="+intf.radio_mac[0]);
        }
    },
    updateInterface: function(intfs, sysid) {
        for (var i = 0; i < intfs.length; i++) {
            var intf = intfs[i];
            var inft_grce = new GlideRecord('x_sitl_telco_sify_sify_aruba_customer_device_interface_temp');
            inft_grce.addQuery('sys_id', sysid);
            inft_grce.addQuery('interface_name', intf.radio_type[0]);
            inft_grce.query();
            if (inft_grce.getRowCount() > 0) {
                while (inft_grce.next()) {
                    inft_grce.name = intf.radio_type[0];
                    inft_grce.radio_interface = intf.radio_interface[0];
                    inft_grce.interface_name = intf.radio_type[0];
                    inft_grce.mac_address = intf.radio_mac[0];
                    inft_grce.update();
                }
            }
        }
    },

    getDeviceStatus: function(airwave_ip, ip) {
        try {
            var aw_id = this.getDeviceFromDb(airwave_ip, ip);
            if (aw_id == "") {
                return "Device Not Found";
            }
            var reqDetails = {};
            var requestParams = {};
            requestParams.url = "/ap_list.xml?id=" + aw_id;
            requestParams.method = "GET";

            var dbDetails = {};
            dbDetails.IP = airwave_ip;
            dbDetails.username = "servicenow";
            dbDetails.password = "Pa$$@123";

            reqDetails.requestParams = requestParams;
            reqDetails.dbDetails = dbDetails;

            reqDetails.isxml = "yes";
            //gs.info(JSON.stringify(reqDetails));
            var response = this.getDevices_MangedWifi(reqDetails);
            gs.info("response" + response);
            if (response == "") {
                return "failed";
            }
            var res_json = JSON.parse(response).items[0];
            var ap = res_json["amp:amp_ap_list"].ap[0];
            return ap.is_up[0];
        } catch (ex) {
            return "failed";
        }
        return "failed";
    },

    getRadioStatus: function(airwave_ip, ip, interface_type) {
        try {
            var aw_id = this.getDeviceFromDb(airwave_ip, ip);
            if (aw_id == "") {
                return "Device Not Found";
            }
            var reqDetails = {};
            var requestParams = {};
            requestParams.url = "/ap_list.xml?id=" + aw_id;
            requestParams.method = "GET";

            var dbDetails = {};
            dbDetails.IP = airwave_ip;
            dbDetails.username = "servicenow";
            dbDetails.password = "Pa$$@123";

            reqDetails.requestParams = requestParams;
            reqDetails.dbDetails = dbDetails;

            reqDetails.isxml = "yes";
            //gs.info(JSON.stringify(reqDetails));
            var response = this.getDevices_MangedWifi(reqDetails);
            if (response == "") {
                return "empty";
            }
            var res_json = JSON.parse(response).items[0];
            var ap = res_json["amp:amp_ap_list"].ap[0];
            var radios = ap.radio;

            var radio_type = interface_type;
            for (var i = 0; i < radios.length; i++) {
                //gs.info(radios[i].radio_type[0]);
                if (radios[i].radio_type[0].includes(radio_type)) {
                    return radios[i].display_enabled[0];
                }
            }
        } catch (ex) {
            return "failed"
        }
        return "failed";
    },
    getBandWidthUsage: function(airwave_ip, ip, starttime, stoptime) {
        var aw_id = this.getDeviceFromDb(airwave_ip, ip);
        if (aw_id == "") {
            return "Device Not Found";
        }
        var reqDetails = {};
        var requestParams = {};
        requestParams.url = "/api/rrd_xport.json?start=" + starttime + "&stop=" + stoptime + "&type=ap_bandwidth&group_by=Avg&url=%2Fap_monitoring&id=" + aw_id;
        requestParams.method = "GET";
        //gs.info(requestParams.url);
        var dbDetails = {};
        dbDetails.IP = airwave_ip;
        dbDetails.username = "servicenow";
        dbDetails.password = "Pa$$@123";

        reqDetails.requestParams = requestParams;
        reqDetails.dbDetails = dbDetails;

        var response = this.getDevices_MangedWifi(reqDetails);
        var res_json = JSON.parse(response).items[0];
        var series = res_json.series;
        var value = 0;
        for (var i = 0; i < series.length; i++) {
            value = value + series[i].avg;
        }
        if (value > 20000) {
            return "false";
        }
        return "true";
    },
    getCpuUtilization: function(airwave_ip, ip, starttime, stoptime) {
        var aw_id = this.getDeviceFromDb(airwave_ip, ip);
        if (aw_id == "") {
            return "Device Not Found";
        }
        var reqDetails = {};
        var requestParams = {};
        requestParams.url = "/api/rrd_xport.json?start=" + starttime + "&stop=" + stoptime + "&type=aggregate_ap_cpu&group_by=Max&url=%2Fap_monitoring&id=" + aw_id;
        requestParams.method = "GET";

        var dbDetails = {};
        dbDetails.IP = airwave_ip;
        dbDetails.username = "servicenow";
        dbDetails.password = "Pa$$@123";

        reqDetails.requestParams = requestParams;
        reqDetails.dbDetails = dbDetails;

        var response = this.getDevices_MangedWifi(reqDetails);
        var res_json = JSON.parse(response).items[0];
        var series = res_json.series;
        var value = 0;
        for (var i = 0; i < series.length; i++) {
            value = value + series[i].avg;
        }

        return value;
    },
    getMemUtilization: function(airwave_ip, ip, starttime, stoptime) {
        var aw_id = this.getDeviceFromDb(airwave_ip, ip);
        if (aw_id == "") {
            return "Device Not Found";
        }
        var reqDetails = {};
        var requestParams = {};
        requestParams.url = "/api/rrd_xport.json?start=" + starttime + "&stop=" + stoptime + "&type=ap_memory&group_by=Max&url=%2Fap_monitoring&id=" + aw_id + "&ds=mem_free";
        requestParams.method = "GET";
        //gs.info(requestParams.url);
        var dbDetails = {};
        dbDetails.IP = airwave_ip;
        dbDetails.username = "servicenow";
        dbDetails.password = "Pa$$@123";

        reqDetails.requestParams = requestParams;
        reqDetails.dbDetails = dbDetails;

        var response = this.getDevices_MangedWifi(reqDetails);
        var res_json = JSON.parse(response).items[0];
        var series = res_json.series;
        var value = 0;
        for (var i = 0; i < series.length; i++) {
            value = series[i].avg;
        }
        return value;
    },
    getDeviceFromDb: function(airwave_ip, ip) {
        var aw_id = "";
        var device = new GlideRecord('x_sitl_telco_sify_u_cmdb_ci_sify_ce_device_managed_wifi');
        device.addQuery('ip_address', ip);
        device.addQuery('airwave_ip', airwave_ip);
        device.query();
        if (device.getRowCount() > 0) {
            while (device.next()) {
                aw_id = device.u_airwave_id;
            }
        }
        return aw_id;
    },
    getConnectiveLinkStatus: function(p_int_link, s_int_link, p_mpls, s_mpls, trap) {
        var p_int_status = false;
        var s_int_status = false;
        var p_mpls_status = false;
        var s_mpls_status = false;

        var s = new Sify_Utility_SubService();
        var output = {};
        if (p_int_link || s_int_link || p_mpls || s_mpls) {

        } else {
            output.status = true;
            output.message = "All the link is empty,so status is consider true";
            return output;
        }
        if (p_int_link) {
            var req = s.getLinkInfo(p_int_link, false);
            if (req.Data.pe.l2transport) {
                p_int_status = this.getL2vpnStatus(p_int_link);
            } else {
                p_int_status = this.getWanpingstatus(p_int_link);
            }
        }

        if (s_int_link && !p_int_status) {
            var req1 = s.getLinkInfo(s_int_link, false);
            if (req1.Data.pe.l2transport) {
                s_int_status = this.getL2vpnStatus(s_int_link);
            } else {
                s_int_status = this.getWanpingstatus(s_int_link);
            }
        }

        if (p_mpls) {
            var req2 = s.getLinkInfo(p_mpls, false);
            if (req2.Data.pe.l2transport) {
                p_mpls_status = this.getL2vpnStatus(p_mpls);
            } else {
                p_mpls_status = this.getWanpingstatus(p_mpls);
            }
        }

        if (s_mpls && !p_mpls_status) {
            var req3 = s.getLinkInfo(s_mpls, false);
            if (req3.Data.pe.l2transport) {
                s_mpls_status = this.getL2vpnStatus(s_mpls);
            } else {
                s_mpls_status = this.getWanpingstatus(s_mpls);
            }
        }
        var int_status = false;
        var mpls_status = false;

        if (p_int_link || s_int_link) {
            int_status = true;
        }
        if (p_mpls || s_mpls) {
            mpls_status = true;
        }
        var sc = {};
        sc.pintlink = p_int_link;
        sc.pintstatus = p_int_status;
        sc.sintlink = s_int_link;
        sc.sintstatus = s_int_status;
        sc.pmpls = p_mpls;
        sc.pmplsstatus = p_mpls_status;
        sc.smpls = s_mpls;
        sc.smplsstatus = s_mpls_status;


        var message = "PrimaryLink:" + p_int_link + " PStatus:" + p_int_status + " SecLink:" + s_int_link + " SStatus:" + s_int_status + " PMpls:" + p_mpls + " PMstatus:" + p_mpls_status + "  SMpls:" + s_mpls + " SMStatus:" + s_mpls_status;

        if (int_status && mpls_status) {
            var s1 = (p_int_status || s_int_status) && (p_mpls_status || s_mpls_status);
            output.status = s1;
            message = message + this.checkSifyCase(s1, sc, trap);
        } else if (int_status) {
            var s2 = (p_int_status || s_int_status);
            output.status = s2;
            message = message + this.checkSifyCase(s2, sc, trap);
        } else if (mpls_status) {
            var s3 = (p_mpls_status || s_mpls_status);
            output.status = s3;
            message = message + this.checkSifyCase(s3, sc, trap);
        } else {
            output.status = false;
        }
        output.message = message;
        return output;
    },
    checkSifyCase: function(status, sc, trap) {
        var msg = "";
        if (!status) {
            if (sc.pintlink && !sc.pintstatus) {
                msg = msg + "" + this.caseUpdateorCreate(sc.pintlink, trap);
            }
            if (sc.sintlink && !sc.sintstatus) {
                msg = msg + "" + this.caseUpdateorCreate(sc.sintlink, trap);
            }
            if (sc.pmpls && !sc.pmplsstatus) {
                msg = msg + "" + this.caseUpdateorCreate(sc.pmpls, trap);
            }
            if (sc.smpls && !sc.smplsstatus) {
                msg = msg + "" + this.caseUpdateorCreate(sc.smpls, trap);
            }
        }
        return msg;
    },
    caseUpdateorCreate: function(linkid, trap) {
        var msg = "";
        var ca = new GlideRecord('x_sitl_telco_sify_sify_case');
        ca.addQuery('cmdb_ci.name', linkid);
        ca.addQuery('state', "!=", 3);
        ca.addQuery('category', "=", 105);
        ca.query();
        if (ca.getRowCount() > 0) {
            while (ca.next()) {
                ca.work_notes = "Due to Link Down Mwifi Alert is skipped: " + trap;
                ca.update();
                msg = linkid + "Case is Updated";
            }
        } else {
            var ca1 = new GlideRecord('x_sitl_telco_sify_sify_case');
            ca1.initialize();
            ca1.category = 105;
            ca1.u_link = linkid;
            ca1.cmdb_ci.setDisplayValue(linkid);
            ca1.contact_type = "NMS";
            ca1.work_notes = "Due to Link Down Mwifi Alert is skipped: " + trap;
            ca1.insert();
            msg = linkid + "Case is created";
        }
        return msg;
    },
    updateTicket: function(ip, airwave_ip, category, ticket) {
        try {
            var type = "SET";
            var device = new GlideRecord('x_sitl_telco_sify_sify_managed_wifi_alerts');
            device.addQuery('configurationitem', ip);
            device.addQuery('airwaveip', airwave_ip);
            device.addQuery('category', category);
            device.addQuery('type', type);
            device.orderByDesc('sys_updated_on');
            device.setLimit(1);
            device.query();

            if (device.getRowCount() > 0) {
                while (device.next()) {
                    device.ticket = ticket;
                    device.update();
                }
            }
        } catch (ex) {

        }
    },
    resolveTicket: function(airwaveip, ip, category) {
        var out = {};
        var s = new Sify_Managed_Wifi();
        var gr = new GlideRecord('x_sitl_telco_sify_sify_incident_cus');
        gr.addQuery("cmdb_ci.name", ip);
        gr.addQuery("u_airwaveip", airwaveip);
        gr.addQuery("category", category);
        gr.addQuery("state", "!=", 3);
        gr.addQuery("state", "!=", 6);
        gr.addQuery("state", "!=", 31);
        gr.query();
        if (gr.getRowCount() > 0) {
            if (gr.next()) {
                var tnumber = gr.number;
                gr.state = 31;
                gr.update();
            }

            out.status = "Ticket " + tnumber + "is Technically resolved";
        } else {
            out.status = "Ticket Not Exists";
        }
        return out;
    },
    getWanpingstatus: function(linkid) {
        var si = new Sify_Utility_Service();
        var js = si.getWanPingStatus(linkid, false);
        if (js) {
            var js1 = JSON.parse(js);
            //gs.info("wan ping:"+JSON.stringify(js1));
            if (js1.status !== "success") {
                return true;
            }
            if ("success" == js1.data.wanping_status) {
                return true;
            }
        } else {
            return true;
        }
        return false;
    },
    getL2vpnStatus: function(linkid) {
        var obj = new SOTAutomationFunctions();
        var ou = obj.getL2vpnStatusByLinkId(linkid);
        //gs.info("L2vpn:"+JSON.stringify(ou));
        if (ou && ou.status == "success") {
            return ou.xconnect;
        } else {
            return true;
        }
    },
    getDevices_MangedWifi: function(reqBulk) {
        var r = new sn_ws.RESTMessageV2('SifyManagedWifi', 'getDevices');
        //r.setRequestHeader("token","375941e0-1c1b-4f46-8944-89757423da6b");
        r.setRequestHeader("Content-Type", "application/json");
        r.setRequestBody(JSON.stringify(reqBulk));
        r.setHttpTimeout(10000);
        var instanceName = gs.getProperty('instance_name');

        if (instanceName == 'sify') {
            //gs.info(gs.getProperty('x_sitl_telco_sify.baseProxyURL'));
            r.setStringParameter("baseProxyURL", gs.getProperty('x_sitl_telco_sify.baseProxyURL'));
            r.setRequestHeader("token", gs.getProperty('x_sitl_telco_sify.proxyAccessToken'));
        } else {
            //gs.info(gs.getProperty('x_sitl_telco_sify.baseProxyURLTesting'));
            r.setStringParameter("baseProxyURL", gs.getProperty('x_sitl_telco_sify.baseProxyURLTesting'));
            r.setRequestHeader("token", gs.getProperty('x_sitl_telco_sify.proxyAccessTokenTesting'));
        }
        var response1 = r.execute();
        var responseBody = response1.getBody();
        var httpStatus = response1.getStatusCode();
        //gs.info("responseBody:::"+responseBody);
        //gs.info("httpStatus:::"+httpStatus);
        return responseBody;
    },
    type: 'Sify_Managed_Wifi'
};