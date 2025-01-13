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
		let SignatureSection, SourceSection, ref, title;

		let userDate = formatDate(req.date);
		let budgetHolderDate = formatDate(
			req?.hoderCheckDate || req?.holderCheckDate,
		);

		let reviewedDate = req.reviewedDate
			? formatDate(req.reviewedDate)
			: req.checkedDate
			? formatDate(req.checkedDate)
			: null;
		let approveDate = formatDate(req.approvedDate);
		// let reqDate = formatDate(req.date);
		let date = formatDateSpace(req.date);

		// if (req.type === "Fund Req" || req.type === "Requisition") {
		// 	title = "FUND REQUISITON";
		// } else if (req.type === "Petty") {
		// 	title = "PETTY CASH";
		// } else if (req.type === "Reimbursement") {
		// 	title = "REIMBURSEMENT";
		// } else if (req.type === "Advance") {
		// 	title = "ADVANCE PAYMENT";
		// } else {
		// 	title = "Fund Requisition";
		// }

		if (req.type === "Advance") {
			title = "STAFF ADVANCE";
		} else {
			title = "PAYMENT VOUCHER";
		}

		let userSignature =
			req.user && req.user.signatureUrl
				? await tobase64(req.user.signatureUrl)
				: blank_document;
		let logo = await tobase64("/assets/logos/ppdc-new-logo.png");
		let approveSignature =
			req.approvedBy && req.approvedBy.signatureUrl
				? await tobase64(req.approvedBy.signatureUrl)
				: blank_document;

		const refNeamGenerator = (rq) => {
			if (rq?.projectName) {
				return (
					formatDateHyphen(rq.date) + rq.projectName.substr(0, 3).toUpperCase()
				);
			} else if (rq?.projectChargedTo?.projectName) {
				return (
					formatDateHyphen(rq.date) +
					rq.projectChargedTo.projectName.substr(0, 3).toUpperCase()
				);
			} else {
				return formatDateHyphen(rq.date) + "";
			}
		};

		const projNameFunc = (rq) => {
			if (rq?.projectName) {
				return rq.projectName;
			} else if (rq?.projectChargedTo?.projectName) {
				return rq.projectChargedTo.projectName;
			} else {
				return "n/a";
			}
		};
		const sourceAcctFunc = (rq) => {
			if (rq.sourceAccountNumber) {
				return rq.sourceAccountNumber;
			} else if (rq?.projectChargedTo?.account) {
				return rq.projectChargedTo.account.accountNumber;
			} else {
				return "n/a";
			}
		};
		const sourceBankFunc = (rq) => {
			if (rq.sourceBankName) {
				return rq.sourceBankName;
			} else if (rq?.projectChargedTo?.account) {
				return rq.projectChargedTo.account.bankName;
			} else {
				return "n/a";
			}
		};

		if (
			req.type === "Fund Req" ||
			req.type === "Requisition" ||
			req.type === "Advance" ||
			req.type === "Reimbursement"
		) {
			ref = refNeamGenerator(req);
			let budgetHolderSig =
				req.holderCheck && req.holderCheck?.signatureUrl
					? await tobase64(req.holderCheck.signatureUrl)
					: blank_document;
			let reviewedSignature =
				req.reviewedBy && req.reviewedBy.signatureUrl
					? await tobase64(req.reviewedBy.signatureUrl)
					: req.checkedBy && req.checkedBy.signatureUrl
					? await tobase64(req.checkedBy.signatureUrl)
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
					{
						text: req.holderCheck?.name || " ",
						style: "fieldStyle",
					},
					{ text: budgetHolderDate || " ", style: "fieldStyle" },
					{ image: budgetHolderSig || " ", width: 30, height: 30 },
				],
				[
					{ text: "Reviewed By", style: "labelStyle" },
					{
						text: req?.reviewedBy?.name || req?.checkedBy?.name || " ",
						style: "fieldStyle",
					},
					{
						text: reviewedDate || " ",
						style: "fieldStyle",
					},
					{ image: reviewedSignature, width: 30, height: 30 },
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
						text: projNameFunc(req),
						style: "fieldStyle",
					},
				],
				[
					{
						text: "Source Bank Name",
						style: "labelStyle",
					},
					{
						text: sourceBankFunc(req),
						style: "fieldStyle",
					},
				],
				[
					{
						text: "Source Account Number",
						style: "labelStyle",
					},
					{
						text: sourceAcctFunc(req),
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
						stack: [
							{
								text: `Approval Number: ${ref}/${req.approvalNumber}`,
								style: "reference",
							},
							{
								text: `Serial Number: ${req.serialNumber}`,
								style: "reference",
							},
						],
						margin: [130, 0, 0, 0],
					},
				],
				margin: [20, 10],
			},
			footer: {
				text: "Gwapp 3.0",
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
					text: projNameFunc(req),
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
								text: req.accountName || "N/A",
								style: "fieldStyle",
							},
						],
						[
							{
								text: "Beneficiary Bank Name",
								style: "labelStyle",
							},
							{
								text: req.bankName || "N/A",
								style: "fieldStyle",
							},
						],
						[
							{
								text: "Beneficiary Account Number",
								style: "labelStyle",
							},
							{
								text: req.accountNumber || "N/A",
								style: "fieldStyle",
							},
							],
					],
				},
				{
					columns: [
						[
							{
								text: "Vendor Business Name",
								style: "labelStyle",
							},
							{
								text: req.vendorBusinessName || "N/A",
								style: "fieldStyle",
							},
						],
						[
							{
								text: "Vendor TIN",
								style: "labelStyle",
							},
							{
								text: req.vendorTIN || "N/A",
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
					color: "#006c37",
				},
			},
		};

		return dd;
	} catch (error) {
		console.log("Failed to Print", error);
		toast.error("Failed to Print\n", error?.message);
	}
};
