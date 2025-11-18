// src/pages/Contacts.jsx
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { FaSearch, FaPlus, FaFilter } from "react-icons/fa";
import AddContactModal from "../components/AddContactModal";
import EditContactModal from "../components/EditContactModal";
import DeleteConfirm from "../components/DeleteConfirm";
import FiltersDrawer from "../components/FiltersDrawer";
import { getContacts, createContact, updateContact, deleteContact } from "../api/contact";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [filters, setFilters] = useState({
    q: "",
    sort: "newest",
    city: "",
    company: "",
  });

  const [companies, setCompanies] = useState([]);

  const detectCity = (address = "") => {
    if (!address) return "";
    const cities = ["delhi", "mumbai", "bangalore", "kolkata", "chennai", "hyderabad"];
    const s = address.toLowerCase();
    for (const c of cities)
      if (s.includes(c)) return c.charAt(0).toUpperCase() + c.slice(1);
    return "";
  };

  const fetch = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await getContacts();
      const data = res.data.contacts || res.data;

      setContacts(data);
      setCompanies([...new Set(data.map((c) => c.company).filter(Boolean))]);
    } catch (err) {
      console.error("Contact fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const filtered = useMemo(() => {
    let list = [...contacts];

    if (filters.q) {
      const q = filters.q.toLowerCase();
      list = list.filter((c) =>
        [c.name, c.email, c.phone, c.company, c.address]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    if (filters.city) list = list.filter((c) => detectCity(c.address) === filters.city);
    if (filters.company) list = list.filter((c) => c.company === filters.company);

    if (filters.sort === "newest")
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (filters.sort === "oldest")
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (filters.sort === "az")
      list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [contacts, filters]);

  const handleCreate = async (data) => {
    await createContact(data);
    fetch();
  };

  const handleUpdate = async (id, data) => {
    await updateContact(id, data);
    fetch();
  };

  const handleDelete = async (id) => {
    await deleteContact(id);
    setDeleteOpen(false);
    fetch();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn px-1">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-400">Contacts</h1>

          <button
            onClick={() => setAddOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-lg shadow hover:scale-105 transition"
          >
            + Add Contact
          </button>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="flex flex-wrap items-center gap-3 bg-[#0d1117] p-4 rounded-xl shadow border border-gray-800">

          {/* Search Bar */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              placeholder="Search name, email, phone, company or address"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#0b0f14] border border-gray-700 text-gray-200 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Inline Filters */}
          <select
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="p-2 bg-[#0b0f14] border border-gray-700 rounded-lg text-gray-300"
          >
            <option value="">All Cities</option>
            {["Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai", "Hyderabad"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="p-2 bg-[#0b0f14] border border-gray-700 rounded-lg text-gray-300"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A → Z</option>
          </select>

          <select
            value={filters.company}
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
            className="p-2 bg-[#0b0f14] border border-gray-700 rounded-lg text-gray-300"
          >
            <option value="">All Companies</option>
            {companies.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* Mobile Drawer Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden p-3 bg-purple-600 text-white rounded-lg"
          >
            <FaFilter />
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-[#0d1117] p-6 rounded-xl shadow-xl border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-200">
              <thead>
                <tr className="text-gray-300 border-b border-gray-700 bg-[#0b0f14]">
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Company</th>
                  <th className="py-3 px-4 text-left">Address</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((c, i) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-800 hover:bg-gray-800/40 transition duration-150"
                  >
                    <td className="py-3 px-4 text-gray-400">{i + 1}</td>
                    <td className="py-3 px-4">{c.name}</td>
                    <td className="py-3 px-4">{c.email}</td>
                    <td className="py-3 px-4">{c.phone || "-"}</td>
                    <td className="py-3 px-4">{c.company || "-"}</td>
                    <td className="py-3 px-4">{c.address || "-"}</td>

                    <td className="py-3 px-4 text-right space-x-4">
                      <button
                        onClick={() => {
                          setSelected(c);
                          setEditOpen(true);
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setSelected(c);
                          setDeleteOpen(true);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loading && <p className="text-gray-400 mt-4">Loading...</p>}
            {!loading && filtered.length === 0 && (
              <p className="text-gray-400 mt-4">No contacts found.</p>
            )}
          </div>
        </div>

        {/* Floating Add Button */}
        <button
          onClick={() => setAddOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-500 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition text-2xl"
        >
          <FaPlus />
        </button>

        {/* Modals */}
        <AddContactModal open={addOpen} onClose={() => setAddOpen(false)} onCreate={handleCreate} />
        <EditContactModal open={editOpen} contact={selected} onClose={() => setEditOpen(false)} onUpdate={handleUpdate} />
        <DeleteConfirm open={deleteOpen} contact={selected} onClose={() => setDeleteOpen(false)} onDelete={handleDelete} />
        <FiltersDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} filters={filters} setFilters={setFilters} companies={companies} />

      </div>
    </DashboardLayout>
  );
}
