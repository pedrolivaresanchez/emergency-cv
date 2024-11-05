export function PhoneInput({ onChange, phoneNumber }) {
  return (
    <div className="mb-4">
      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
        Número de teléfono
      </label>
      <div>
        <img
          class="p-FlagIcon"
          src="https://js.stripe.com/v3/fingerprinted/img/FlagIcon-ES-50338dbf85adff5e94100675aba26309.svg"
          alt="ES"
        />
        <input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="612345678"
          required
        />
      </div>
    </div>
  );
}
