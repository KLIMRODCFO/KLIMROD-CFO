"use client";
import AuthenticatedLayout from "@/app/components/AuthenticatedLayout";
import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

interface QuickOnboardingForm {
	firstName: string;
	middleName: string;
	lastName: string;
	department: string;
	position: string;
	phone?: string;
	email?: string;
	dob?: string;
	address?: string;
	startDate?: string;
}

export default function QuickOnboardingPage() {
	const departmentOptions = [
		"FOH", "BOH", "MANAGEMENT", "ADMINISTRATIVE"
	];
	const positionOptions = [
		"SERVER", "BUSSER", "BARTENDER", "BARBACK", "RUNNER", "HOST", "MAITRE D", "SOMMELIER"
	];
const bohPositions = [
	"EXECUTIVE CHEF",
	"HEAD CHEF",
	"SOUS CHEF",
	"KITCHEN MANAGER",
	"LINE COOK",
	"PREP COOK",
	"GRILL COOK",
	"SAUTÉ COOK",
	"FRY COOK",
	"PASTA COOK",
	"PIZZA COOK",
	"PIZZAIOLI",
	"GARDE MANGER",
	"PANTRY COOK",
	"PASTRY CHEF",
	"PASTRY COOK",
	"DISHWASHER",
	"KITCHEN PORTER"
];
const fohPositions = [
	"SERVER", "BUSSER", "BARTENDER", "BARBACK", "RUNNER", "HOST", "MAITRE D", "SOMMELIER"
];
const managementPositions = ["GENERAL MANAGER", "ASSISTANT MANAGER", "FLOOR MANAGER"];
const adminPositions = ["ACCOUNTANT", "HR", "ADMINISTRATOR"];
	const [form, setForm] = useState<QuickOnboardingForm>({
		firstName: "",
		middleName: "",
		lastName: "",
		department: "",
		position: "",
		phone: "",
		email: "",
		dob: "",
		address: "",
		startDate: ""
	});
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const restaurantId = localStorage.getItem("active_restaurant_id") || "default";
		const { error } = await supabase.from("MASTER_EMPLOYEE_DIRECTORY").insert([
			{
				first_name: form.firstName ? form.firstName.toUpperCase() : null,
				middle_name: form.middleName ? form.middleName.toUpperCase() : null,
				last_name: form.lastName ? form.lastName.toUpperCase() : null,
				department: form.department ? form.department.toUpperCase() : null,
				position: form.position ? form.position.toUpperCase() : null,
				phone: form.phone ? form.phone.toUpperCase() : null,
				email: form.email ? form.email.toUpperCase() : null,
				dob: form.dob || null,
				address: form.address ? form.address.toUpperCase() : null,
				start_date: form.startDate || null,
				status: "ACTIVE",
				restaurant_id: restaurantId ? restaurantId.toUpperCase() : null,
				user_id: "00000000-0000-0000-0000-000000000000"
			}
		]);
		setLoading(false);
		if (error) {
			alert("Error guardando en el directorio: " + error.message);
		} else {
			setShowModal(true);
			setForm({
				firstName: "",
				middleName: "",
				lastName: "",
				department: "",
				position: "",
				phone: "",
				email: "",
				dob: "",
				address: "",
				startDate: ""
			});
		}
	};

	return (
		<AuthenticatedLayout>
			<div className="max-w-3xl mx-auto mt-10 p-0 rounded shadow">
				<h2 className="text-2xl font-bold mb-6 px-6 pt-6 tracking-wide uppercase text-center">QUICK ONBOARDING</h2>
				<form onSubmit={handleSubmit} className="">
					<div className="grid grid-cols-2 border rounded overflow-hidden">
						{/* Labels (col 1) */}
						<div className="flex flex-col bg-gray-900 text-white font-semibold text-sm divide-y divide-gray-800">
							{[
								'FIRST NAME *',
								'MIDDLE NAME',
								'LAST NAME *',
								'DEPARTMENT *',
								'POSITION *',
								'PHONE',
								'EMAIL',
								'DATE OF BIRTH',
								'ADDRESS',
								'START DATE'
							].map((label, idx) => (
								<label key={label} className="px-6 h-14 flex items-center uppercase">{label}</label>
							))}
						</div>
						{/* Inputs (col 2) */}
						<div className="flex flex-col divide-y divide-gray-200">
							<div className="px-6 h-14 flex items-center justify-center"><input name="firstName" value={form.firstName} onChange={handleChange} required className="w-3/4 border px-3 py-2 rounded h-10 text-center" /></div>
							<div className="px-6 h-14 flex items-center justify-center"><input name="middleName" value={form.middleName} onChange={handleChange} className="w-3/4 border px-3 py-2 rounded h-10 text-center" /></div>
							<div className="px-6 h-14 flex items-center justify-center"><input name="lastName" value={form.lastName} onChange={handleChange} required className="w-3/4 border px-3 py-2 rounded h-10 text-center" /></div>
							<div className="px-6 h-14 flex items-center justify-center">
								<select
									name="department"
									value={form.department}
									onChange={handleChange}
									required
									className="w-3/4 border px-3 py-2 rounded h-10 bg-white text-black text-center"
								>
									<option value="" disabled>Select department</option>
									{departmentOptions.map(opt => (
										<option key={opt} value={opt}>{opt}</option>
									))}
								</select>
							</div>
							<div className="px-6 h-14 flex items-center justify-center">
								<select
									name="position"
									value={form.position}
									onChange={handleChange}
									required
									className="w-3/4 border px-3 py-2 rounded h-10 bg-white text-black text-center"
								>
									<option value="" disabled>Select position</option>
									{(form.department === "BOH"
										? bohPositions
										: form.department === "FOH"
											? fohPositions
											: form.department === "MANAGEMENT"
												? managementPositions
												: form.department === "ADMINISTRATIVE"
													? adminPositions
													: []
									).map(opt => (
										<option key={opt} value={opt}>{opt}</option>
									))}
								</select>
							</div>
							<div className="px-6 h-14 flex items-center justify-center"><input name="phone" value={form.phone} onChange={handleChange} className="w-3/4 border px-3 py-2 rounded h-10 text-center" /></div>
							<div className="px-6 h-14 flex items-center justify-center"><input name="email" value={form.email} onChange={handleChange} className="w-3/4 border px-3 py-2 rounded h-10 text-center" /></div>
							<div className="px-6 h-14 flex items-center justify-center">
								<input
									name="dob"
									value={form.dob}
									onChange={handleChange}
									className="w-3/4 border px-3 py-2 rounded h-10 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-[center]"
									type="date"
									placeholder="mm/dd/yyyy"
									style={{ textAlign: 'center', textAlignLast: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex' }}
								/>
							</div>
							<div className="px-6 h-14 flex items-center justify-center"><input name="address" value={form.address} onChange={handleChange} className="w-3/4 border px-3 py-2 rounded h-10 text-center" /></div>
							<div className="px-6 h-14 flex items-center justify-center">
								<input
									name="startDate"
									value={form.startDate}
									onChange={handleChange}
									className="w-3/4 border px-3 py-2 rounded h-10 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-[center]"
									type="date"
									placeholder="mm/dd/yyyy"
									style={{ textAlign: 'center', textAlignLast: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex' }}
								/>
							</div>
						</div>
					</div>
					<div className="flex justify-center px-6 py-6 border-t mt-0">
						<button
							type="submit"
							className="px-8 py-3 bg-black text-white font-bold rounded hover:bg-gray-900 transition disabled:opacity-60 shadow-md"
							disabled={loading}
						>
							{loading ? "Saving..." : "COMPLETE QUICK ONBOARDING"}
						</button>
					</div>
					{showModal && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
							<div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
								<h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
									KLIMROD CFO
								</h2>
								<h3 className="text-lg font-semibold text-center text-gray-700 mb-6">
									NEXT STEP
								</h3>
								<p className="text-sm text-gray-600 mb-4 text-center">
									Would you like to continue with the full hiring process now, or would you prefer to complete it later?
								</p>
								<div className="flex gap-3">
									<button
										onClick={() => setShowModal(false)}
										className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 border-2 border-gray-300 rounded font-semibold text-sm hover:bg-gray-300 transition"
									>
										COMPLETE LATER
									</button>
									<button
										onClick={() => setShowModal(false)}
										className="flex-1 px-4 py-3 bg-gray-900 text-white border-2 border-gray-800 rounded font-semibold text-sm hover:bg-gray-800 transition"
									>
										CONTINUE NOW
									</button>
								</div>
							</div>
						</div>
					)}
				</form>
			</div>
		</AuthenticatedLayout>
	);
}
