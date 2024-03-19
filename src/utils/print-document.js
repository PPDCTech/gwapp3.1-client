import * as accounting from "accounting";
import { tobase64, currencyCodes } from "../services/helpers";
import { formatDate, formatDateHyphen, formatDateSpace } from "./format-date";
import { toast } from "react-toastify";

export const printDocument = async (req) => {
  try {
    if (!req.approvedBy && !req.checkedBy) {
      return toast.error("Requisition must be checked and approved");
    }

    const blank_document = await tobase64("/assets/blankDoc.png");
    let SignatureSection, SourceSection, ref;

    let userDate = formatDate(req.date);
    let budgetHolderDate = formatDate(req.hoderCheckDate || req.holderCheckDate);
    let checkDate = formatDate(req.checkDate);
    let reviewedDate = formatDate(req.reviewDate);
    let approveDate = formatDate(req.approvedDate);
    let reqDate = formatDate(req.date);
    let date = formatDateSpace(req.date);
    //   let date = req.date;

    const title = req.type === "Fund Req" ? "FUND REQUISITON" : "PETTY CASH";

    let userSignature =
      req.user && req.user.signatureUrl ? await tobase64(req.user.signatureUrl) : blank_document;
    let logo = await tobase64("/assets/logos/ppdc-new-logo.png");
    let approveSignature =
      req.approvedBy && req.approvedBy.signatureUrl
        ? await tobase64(req.approvedBy.signatureUrl)
        : blank_document;
    if (req.type === "Fund Req") {
      ref = formatDateHyphen(req.date) + req?.projectName ? req.projectName.substr(0, 3).toUpperCase() : "";

      let budgetHolderSig =
        req.holderCheck && req.holderCheck.signatureUrl
          ? await tobase64(req.holderCheck.signatureUrl)
          : blank_document;
      let checkedSignature =
        req.checkedBy && req.checkedBy.signatureUrl
          ? await tobase64(req.checkedBy.signatureUrl)
          : blank_document;
      let reviewedSignature =
        req.reviewedBy && req.reviewedBy.signatureUrl
          ? await tobase64(req.reviewedBy.signatureUrl)
          : blank_document;

      SignatureSection = [
        [
          { text: "Raised By", style: "labelStyle" },
          { text: req.user.name, style: "fieldStyle" },
          { text: userDate, style: "fieldStyle" },
          { image: userSignature, width: 30, height: 30 },
        ],
        [
          { text: "Budget Holder", style: "labelStyle" },
          { text: req.holderCheck.name, style: "fieldStyle" },
          { text: budgetHolderDate, style: "fieldStyle" },
          { image: budgetHolderSig, width: 30, height: 30 },
        ],
        [
          { text: "Reviewed By", style: "labelStyle" },
          { text: req?.reviewedBy?.name || req?.checkedBy?.name || " ", style: "fieldStyle" },
          { text: reviewedDate || checkDate || " ", style: "fieldStyle" },
          { image: reviewedSignature || checkedSignature || blank_document, width: 30, height: 30 },
        ],
        [
          { text: "Approved By", style: "labelStyle" },
          { text: req.approvedBy.name, style: "fieldStyle" },
          { text: approveDate, style: "fieldStyle" },
          { image: approveSignature, width: 30, height: 30 },
        ],
      ];

      SourceSection = [
        [
          {
            text: "Project Name",
            style: "labelStyle",
          },
          {
            text: req?.projectName ? req.projectName : "n/a",
            style: "fieldStyle",
          },
        ],
        [
          {
            text: "Source Bank Name",
            style: "labelStyle",
          },
          {
            text: req.sourceBankName,
            style: "fieldStyle",
          },
        ],
        [
          {
            text: "Source Account Number",
            style: "labelStyle",
          },
          {
            text: req.sourceAccountNumber,
            style: "fieldStyle",
          },
        ],
      ];
    } else {
      SignatureSection = [
        [
          { text: "Raised By", style: "labelStyle" },
          { text: req.user.name, style: "fieldStyle" },
          { text: userDate, style: "fieldStyle" },
          { image: userSignature, width: 30, height: 30 },
        ],
        [
          { text: "Approved By", style: "labelStyle" },
          { text: req.approvedBy.name, style: "fieldStyle" },
          { text: approveDate, style: "fieldStyle" },
          { image: approveSignature, width: 30, height: 30 },
        ],
      ];
      SourceSection = [];
      ref = "Petty Cash";
    }

    let itemsDoc = [
      [
        { text: "Item Description", style: "labelStyle" },
        { text: "Budget Line", style: "labelStyle" },
        { text: "Amount", style: "labelStyle" },
      ],
    ];
    req.items.forEach((item) => {
      let row = [
        { text: item.title, style: "tableBodyText" },
        { text: item.code || "", style: "tableBodyText" },
        {
          text: accounting.formatMoney(item.amount, currencyCodes[req.currency]),
          style: "tableBodyText",
        },
      ];
      itemsDoc.push(row);
    });
    var dd = {
      header: {
        columns: [
          {
            image: logo,
            width: 100,
            height: 30,
          },
          {
            text: ref,
            margin: [130, 0, 0, 0],
            style: "reference",
          },
        ],
        margin: [20, 10],
      },
      footer: {
        text: "Gwapp 3.1.0",
        style: "footerStyle",
      },
      content: [
        {
          text: title,
          style: "header",
        },
        {
          text: date,
          style: "dateStyle",
        },
        {
          text: "General Info",
          style: "subheader",
        },
        {
          text: "Name",
          style: "labelStyle",
        },
        {
          text: req.user.name,
          style: "fieldStyle",
        },
        {
          text: "Purpose of Payment",
          style: "labelStyle",
        },
        {
          text: req.title,
          style: "fieldStyle",
        },
        {
          text: "Project Charged To",
          style: "labelStyle",
        },
        {
          text: req?.projectName ? req.projectName : "n/a",
          style: "fieldStyle",
        },
        {
          text: "Bank Details",
          style: "subheader",
        },
        {
          columns: [
            [
              {
                text: "Name of Beneficiary",
                style: "labelStyle",
              },
              {
                text: req.accountName,
                style: "fieldStyle",
              },
            ],
            [
              {
                text: "Beneficiary Bank Name",
                style: "labelStyle",
              },
              {
                text: req.bankName,
                style: "fieldStyle",
              },
            ],
            [
              {
                text: "Beneficiary Account Number",
                style: "labelStyle",
              },
              {
                text: req.accountNumber,
                style: "fieldStyle",
              },
            ],
          ],
        },
        {
          columns: SourceSection,
        },
        {
          text: "Items",
          style: "subheader",
        },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            widths: ["*", "auto", 50],
            body: itemsDoc,
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex % 2 === 0 ? "#CCCCCC" : null;
            },
          },
        },
        {
          columns: [
            [
              { text: "Total", style: "labelStyle" },
              {
                text: accounting.formatMoney(req.total, currencyCodes[req.currency]),
                style: "fieldStyle",
              },
            ],
            [
              { text: "Amount In Words", style: "labelStyle" },
              { text: req.amountInWords, style: "fieldStyle" },
            ],
          ],
        },
        {
          columns: SignatureSection,
        },
      ],

      styles: {
        reference: {
          color: "#006C37",
          alignment: "right",
        },

        header: {
          fontSize: 24,
          alignment: "center",
          margin: [0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          color: "#7cda24",
          margin: [0, 15],
        },
        labelStyle: {
          bold: true,
          fontSize: 10,
          margin: [0, 10, 0, 3],
        },
        fieldStyle: {
          fontSize: 12,
          margin: [0, 3, 0, 5],
          color: "#6C737F",
        },
        tableExample: {
          margin: [0, 10],
        },
        tableBodyText: {
          fontSize: 10,
          italics: true,
        },
        dateStyle: {
          alignment: "center",
          fontSize: "10",
          bold: true,
          color: "#7cda24",
        },
        footerStyle: {
          alignment: "center",
          fontSize: 8,
          margin: [0, 0],
          italics: true,
          color: "#7cda24",
        },
      },
    };

    return dd;
  } catch (error) {
    console.log("Failed to Print", error);
    toast.error("Failed to Print\n", error?.message);
  }
};
