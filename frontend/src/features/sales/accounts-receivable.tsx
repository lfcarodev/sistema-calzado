"use client";

import { useEffect, useState } from "react";

import {
  addSalePayment,
  getAccountsReceivable,
  type AccountReceivable,
} from "@/features/sales/sales-api";

const money = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function AccountsReceivable() {
  const [accounts, setAccounts] = useState<AccountReceivable[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [paymentSaleId, setPaymentSaleId] = useState<number | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [processingSaleId, setProcessingSaleId] = useState<number | null>(null);

  const loadAccounts = async () => {
    const data = await getAccountsReceivable();
    setAccounts(data);
  };

  useEffect(() => {
    setMessage(null);
    setError(null);

    void loadAccounts().catch((loadError) => {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No fue posible cargar la cartera.",
      );
    });
  }, []);

  const pendingAccounts = accounts.filter((account) => !account.isPaid);
  const paidAccounts = accounts.filter((account) => account.isPaid);

  const startPayment = (account: AccountReceivable) => {
    setError(null);
    setMessage(null);
    setPaymentSaleId(account.saleId);
    setPaymentAmount("");
  };

  const cancelPayment = () => {
    if (processingSaleId !== null) {
      return;
    }

    setPaymentSaleId(null);
    setPaymentAmount("");
    setError(null);
  };

  const handlePayment = async (account: AccountReceivable) => {
    setError(null);
    setMessage(null);

    const amount = Number(paymentAmount);

    if (!paymentAmount.trim()) {
      setError("Ingresa el valor del abono.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("El valor del abono debe ser mayor que cero.");
      return;
    }

    if (amount > account.balance) {
      setError(
        `El abono no puede ser mayor que el saldo pendiente de ${money.format(
          account.balance,
        )}.`,
      );
      return;
    }

    try {
      setProcessingSaleId(account.saleId);

      await addSalePayment(account.saleId, amount);

      setPaymentSaleId(null);
      setPaymentAmount("");

      await loadAccounts();

      setMessage(`Abono de ${money.format(amount)} registrado correctamente.`);
    } catch (paymentError) {
      setError(
        paymentError instanceof Error
          ? paymentError.message
          : "No fue posible registrar el abono.",
      );
    } finally {
      setProcessingSaleId(null);
    }
  };

  const handleFullPayment = async (account: AccountReceivable) => {
    setError(null);
    setMessage(null);

    if (account.balance <= 0) {
      setError("Esta cuenta no tiene saldo pendiente.");
      return;
    }

    try {
      setProcessingSaleId(account.saleId);

      await addSalePayment(account.saleId, account.balance);

      setPaymentSaleId(null);
      setPaymentAmount("");

      await loadAccounts();

      setMessage(
        `Pago completo de ${money.format(account.balance)} registrado correctamente.`,
      );
    } catch (paymentError) {
      setError(
        paymentError instanceof Error
          ? paymentError.message
          : "No fue posible registrar el pago completo.",
      );
    } finally {
      setProcessingSaleId(null);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900">CARTERA</h3>
      </div>

      {message && (
        <div className="mx-5 mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mx-5 mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="p-5">
        <h4 className="mb-3 font-semibold text-red-700">Pendientes</h4>

        {pendingAccounts.length === 0 ? (
          <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
            NO HAY CUENTAS PENDIENTES
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Cliente</th>
                  <th>Venta</th>
                  <th>Total</th>
                  <th>Pagado</th>
                  <th>Pendiente</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {pendingAccounts.map((account) => {
                  const isProcessing = processingSaleId === account.saleId;
                  const isPaymentFormOpen = paymentSaleId === account.saleId;

                  return (
                    <tr key={account.saleId}>
                      <td className="px-4 py-3 font-medium">
                        {account.customerName}
                      </td>

                      <td>{account.saleNumber}</td>

                      <td>{money.format(account.total)}</td>

                      <td>{money.format(account.totalPaid)}</td>

                      <td className="font-semibold text-red-700">
                        {money.format(account.balance)}
                      </td>

                      <td className="px-4 py-3">
                        {isPaymentFormOpen ? (
                          <div className="flex min-w-[320px] items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={paymentAmount}
                              onChange={(event) =>
                                setPaymentAmount(event.target.value)
                              }
                              placeholder="Valor del abono"
                              disabled={isProcessing}
                              className="w-36 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                            />

                            <button
                              type="button"
                              onClick={() => void handlePayment(account)}
                              disabled={isProcessing}
                              className="rounded-lg bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isProcessing ? "Guardando..." : "Confirmar"}
                            </button>

                            <button
                              type="button"
                              onClick={cancelPayment}
                              disabled={isProcessing}
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => startPayment(account)}
                              disabled={processingSaleId !== null}
                              className="rounded-lg bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Abonar
                            </button>

                            <button
                              type="button"
                              onClick={() => void handleFullPayment(account)}
                              disabled={processingSaleId !== null}
                              className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isProcessing ? "Guardando..." : "Pago completo"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 p-5">
        <h4 className="mb-3 font-semibold text-green-700">Pagadas</h4>

        {paidAccounts.length === 0 ? (
          <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
            NO HAY VENTAS TOTALMENTE PAGADAS
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Cliente</th>
                  <th>Venta</th>
                  <th>Total</th>
                  <th>Pagado</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {paidAccounts.map((account) => (
                  <tr key={account.saleId}>
                    <td className="px-4 py-3 font-medium">
                      {account.customerName}
                    </td>

                    <td>{account.saleNumber}</td>

                    <td>{money.format(account.total)}</td>

                    <td>{money.format(account.totalPaid)}</td>

                    <td className="font-semibold text-green-700">PAGADA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
