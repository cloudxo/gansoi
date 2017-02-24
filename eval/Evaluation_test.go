package eval

import (
	"testing"

	"github.com/gansoi/gansoi/boltdb"
	"github.com/gansoi/gansoi/database"
)

func TestLatestEvaluation(t *testing.T) {
	db := boltdb.NewTestStore()

	_, err := LatestEvaluation(db, "hello")
	if err == nil {
		t.Fatalf("LatestEvaluation() did not fail when for zero results")
	}

	eval1 := &Evaluation{
		CheckID: "hello",
	}

	err = db.Save(eval1)
	if err != nil {
		t.Fatalf("Save() failed: %s", err.Error())
	}

	_, err = LatestEvaluation(db, "hello")
	if err != nil && err != database.ErrNotFound {
		t.Fatalf("LatestEvaluation() failed: %s", err.Error())
	}
}
