(function(){
  "use strict";
  const U=Pandao,E=ToolEditor,P=Planning;
  const columns=[{label:"账单编号",key:"invoice"},{label:"客户",key:"customer"},{label:"到期日期",key:"due",type:"date"},{label:"账单金额",key:"amount",type:"number",default:0},{label:"已收金额",key:"paid",type:"number",default:0}];
  const examples=[{invoice:"DEMO-A001",customer:"演示客户甲",due:"2026-09-15",amount:12000,paid:4000},{invoice:"DEMO-A002",customer:"演示客户乙",due:"2026-10-15",amount:5000,paid:0},{invoice:"DEMO-A003",customer:"演示客户甲",due:"2026-07-01",amount:6000,paid:1000}];
  function exportRows(v,p){return v.details.map(r=>({统计日期:p.asof,币种:p.currency,账单编号:r.invoice,客户:r.customer,到期日期:r.due,账单金额:r.amount,已收金额:r.paid,未收金额:r.balance,逾期天数:r.days,账龄区间:r.bucket,状态:r.status}));}
  E.workbench({key:"receivables",title:"应收账款账龄助手",icon:"◷",category:"收款管理",description:"按统计日期查看未收金额、逾期账龄和客户余额。",repo:"https://github.com/tianchaodaxing-beep/pandao-receivables",inputTitle:"账单资料",outputTitle:"应收账款",columns,examples,parameters:[["统计日期","asof","2026-09-30","date"],["币种","currency","人民币"]],calculateLabel:"计算账龄",exportLabel:"导出账龄表",compute:(rows,p)=>P.aging(rows,p.asof),export:exportRows,view:(v,p)=>[
    U.metrics([["未收金额",U.money(v.outstanding),p.currency],["逾期金额",U.money(v.overdue),p.currency],["账单数量",v.details.length,"张"]]),
    E.heading("账龄分布"),E.bars(v.buckets.map(r=>({label:r.label,value:r.amount,alert:r.label!=="未逾期"}))),
    E.heading("客户余额"),E.table([{label:"客户",key:"customer"},{label:"未收金额",value:r=>U.money(r.balance),number:true},{label:"逾期金额",value:r=>U.money(r.overdue),number:true}],v.customers),
    E.heading("账单明细"),E.table([{label:"账单编号",key:"invoice"},{label:"到期日期",key:"due"},{label:"未收金额",value:r=>U.money(r.balance),number:true},{label:"逾期天数",key:"days",number:true},{label:"状态",key:"status"}],v.details)
  ]});
})();
