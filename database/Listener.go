package database

type (
	// Listener is an interface for type capable of listening to changes
	// in the database.
	Listener interface {
		// PostApply will be called in its own goroutine when the node detects
		// a change in the database. If leader is true the current node is
		// leader, if leader is false, the current node MAY or MAY NOT be leader.
		PostApply(leader bool, command Command, data interface{}, err error)
	}
)
