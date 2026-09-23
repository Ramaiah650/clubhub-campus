/** Assignment concept map — educational footer panel */
function ConceptMap() {
  const concepts = [
    {
      title: 'Props',
      body: 'App passes club data and handlers into FilterRail, OrgTile, DetailPane, and profile views.',
    },
    {
      title: 'Lists & Keys',
      body: 'Clubs, interest chips, tags, leads, events, and applications render with stable keys via .map().',
    },
    {
      title: 'Search / filter',
      body: 'Live text search combined with interest filters in a single derived list.',
    },
    {
      title: 'Conditional rendering',
      body: 'Detail pane, empty states, Join vs Applied, and toasts appear only when conditions are met.',
    },
    {
      title: 'Component reuse',
      body: 'Shared Chip, Toast, and ThemePicker used across header, detail, and applications.',
    },
  ];

  return (
    <section className="concept-map" aria-labelledby="concept-map-title">
      <h2 id="concept-map-title">React concepts in this app</h2>
      <ul>
        {concepts.map((c) => (
          <li key={c.title}>
            <strong>{c.title}</strong>
            <p>{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ConceptMap;
